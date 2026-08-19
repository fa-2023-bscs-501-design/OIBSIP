const cron = require("node-cron");
const nodemailer = require("nodemailer");
const Inventory = require("../models/Inventory");

// =========================================================
// EMAIL TRANSPORTER
// =========================================================

const createTransporter = () => {
  const host = process.env.EMAIL_HOST;
  const port = Number(process.env.EMAIL_PORT);
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!host || !port || !user || !pass) {
    throw new Error(
      "Email configuration is missing. Please check EMAIL_HOST, EMAIL_PORT, EMAIL_USER and EMAIL_PASS."
    );
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
};

// =========================================================
// SEND LOW STOCK EMAIL
// =========================================================

const sendLowStockEmail = async (items) => {
  const transporter = createTransporter();

  const adminEmail =
    process.env.ADMIN_EMAIL ||
    process.env.EMAIL_USER;

  if (!adminEmail) {
    throw new Error(
      "ADMIN_EMAIL or EMAIL_USER is required."
    );
  }

  const itemRows = items
    .map(
      (item) => `
        <tr>
          <td style="padding:10px;border:1px solid #ddd;">
            ${item.name}
          </td>

          <td style="padding:10px;border:1px solid #ddd;">
            ${item.category}
          </td>

          <td style="padding:10px;border:1px solid #ddd;color:red;font-weight:bold;">
            ${item.stock}
          </td>

          <td style="padding:10px;border:1px solid #ddd;">
            ${item.lowStockThreshold}
          </td>
        </tr>
      `
    )
    .join("");

  await transporter.sendMail({
    from: `"PizzaCraft Admin Alerts" <${process.env.EMAIL_USER}>`,
    to: adminEmail,
    subject: "⚠️ PizzaCraft Low Stock Alert",

    html: `
      <div style="font-family:Arial,sans-serif;max-width:700px;margin:auto;">

        <h2>🍕 PizzaCraft Low Stock Alert</h2>

        <p>
          The following inventory items have reached or fallen below
          their configured low-stock threshold:
        </p>

        <table
          style="
            border-collapse:collapse;
            width:100%;
            margin-top:20px;
          "
        >

          <thead>
            <tr>

              <th style="padding:10px;border:1px solid #ddd;">
                Item
              </th>

              <th style="padding:10px;border:1px solid #ddd;">
                Category
              </th>

              <th style="padding:10px;border:1px solid #ddd;">
                Current Stock
              </th>

              <th style="padding:10px;border:1px solid #ddd;">
                Threshold
              </th>

            </tr>
          </thead>

          <tbody>
            ${itemRows}
          </tbody>

        </table>

        <p style="margin-top:25px;">
          Please update the inventory from the PizzaCraft Admin Dashboard.
        </p>

        <p>
          — PizzaCraft System
        </p>

      </div>
    `,
  });

  console.log(
    `📧 Low-stock email sent to ${adminEmail}`
  );
};

// =========================================================
// CHECK LOW STOCK
// =========================================================

const checkLowStock = async () => {
  try {
    const lowStockItems =
      await Inventory.find({
        $expr: {
          $lte: [
            "$stock",
            "$lowStockThreshold",
          ],
        },
      }).lean();

    if (lowStockItems.length === 0) {
      console.log(
        "✅ Low-stock check complete. No low-stock items."
      );
      return;
    }

    console.log(
      `⚠️ ${lowStockItems.length} low-stock item(s) found.`
    );

    lowStockItems.forEach((item) => {
      console.log(
        `   - ${item.name}: ${item.stock}/${item.lowStockThreshold}`
      );
    });

    await sendLowStockEmail(
      lowStockItems
    );

  } catch (error) {
    console.error(
      "❌ Low-stock job error:",
      error.message
    );
  }
};

// =========================================================
// START SCHEDULED JOB
// =========================================================

const startLowStockJob = () => {

  // Run every 30 minutes

  cron.schedule(
    "*/30 * * * *",
    async () => {

      console.log(
        "⏰ Running scheduled low-stock check..."
      );

      await checkLowStock();
    }
  );

  console.log(
    "⏰ Low-stock scheduler started. Runs every 30 minutes."
  );
};

module.exports = {
  startLowStockJob,
  checkLowStock,
};