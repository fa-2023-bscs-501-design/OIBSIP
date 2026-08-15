import "./AdminDashboard.css";
import { useEffect, useState } from "react";

function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);

  const [loading, setLoading] = useState(true);
  const [inventoryLoading, setInventoryLoading] = useState(true);

  const [updatingId, setUpdatingId] = useState(null);
  const [updatingStockId, setUpdatingStockId] =
    useState(null);

  const token = localStorage.getItem(
    "pizzaCraftToken"
  );

  // ===============================
  // FETCH ORDERS
  // ===============================

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/orders/admin",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch orders"
        );
      }

      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error(
        "Admin orders fetch error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // FETCH INVENTORY
  // ===============================

  const fetchInventory = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/inventory",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch inventory"
        );
      }

      if (data.success) {
        setInventory(data.inventory || []);
      }
    } catch (error) {
      console.error(
        "Inventory fetch error:",
        error
      );

      alert(error.message);
    } finally {
      setInventoryLoading(false);
    }
  };

  // ===============================
  // LOAD DATA
  // ===============================

  useEffect(() => {
    if (token) {
      fetchOrders();
      fetchInventory();
    } else {
      setLoading(false);
      setInventoryLoading(false);
    }
  }, []);

  // ===============================
  // UPDATE ORDER STATUS
  // ===============================

  const updateStatus = async (
    orderId,
    status
  ) => {
    try {
      setUpdatingId(orderId);

      const response = await fetch(
        `http://localhost:5000/api/orders/admin/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update order status"
        );
      }

      if (data.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId
              ? {
                  ...order,
                  status: data.order.status,
                }
              : order
          )
        );
      }
    } catch (error) {
      console.error(
        "Status update error:",
        error
      );

      alert(error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  // ===============================
  // UPDATE STOCK
  // ===============================

  const updateStock = async (
    itemId,
    newStock
  ) => {
    const stock = Number(newStock);

    if (
      Number.isNaN(stock) ||
      stock < 0
    ) {
      alert(
        "Please enter a valid stock value."
      );
      return;
    }

    try {
      setUpdatingStockId(itemId);

      const response = await fetch(
        `http://localhost:5000/api/inventory/${itemId}/stock`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            stock,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update stock"
        );
      }

      if (data.success) {
        setInventory(
          (currentInventory) =>
            currentInventory.map((item) =>
              item._id === itemId
                ? data.item
                : item
            )
        );

        alert(
          `${data.item.name} stock updated successfully ✅`
        );
      }
    } catch (error) {
      console.error(
        "Stock update error:",
        error
      );

      alert(error.message);
    } finally {
      setUpdatingStockId(null);
    }
  };

  // ===============================
  // UPDATE THRESHOLD
  // ===============================

  const updateThreshold = async (
    itemId,
    newThreshold
  ) => {
    const threshold = Number(
      newThreshold
    );

    if (
      Number.isNaN(threshold) ||
      threshold < 0
    ) {
      alert(
        "Please enter a valid threshold value."
      );
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/inventory/${itemId}/threshold`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            lowStockThreshold:
              threshold,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update threshold"
        );
      }

      if (data.success) {
        setInventory(
          (currentInventory) =>
            currentInventory.map((item) =>
              item._id === itemId
                ? data.item
                : item
            )
        );

        alert(
          "Low-stock threshold updated successfully ✅"
        );
      }
    } catch (error) {
      console.error(
        "Threshold update error:",
        error
      );

      alert(error.message);
    }
  };

  // ===============================
  // INVENTORY SUMMARY
  // ===============================

  const totalInventoryItems =
    inventory.length;

  const outOfStockItems =
    inventory.filter(
      (item) => Number(item.stock) === 0
    ).length;

  const lowStockItems =
    inventory.filter(
      (item) =>
        Number(item.stock) > 0 &&
        Number(item.stock) <=
          Number(
            item.lowStockThreshold
          )
    ).length;

  const inStockItems =
    inventory.filter(
      (item) =>
        Number(item.stock) >
        Number(
          item.lowStockThreshold
        )
    ).length;

  // ===============================
  // AUTH CHECK
  // ===============================

  if (!token) {
    return (
      <div
        style={{
          padding: "30px",
        }}
      >
        <h2>
          Authentication required
        </h2>

        <p>
          Please login as an admin first.
        </p>
      </div>
    );
  }

  // ===============================
  // UI
  // ===============================

  return (
    <div className="admin-dashboard">
      {/* ===============================
          HEADER
      =============================== */}

      <div
        style={{
          marginBottom: "35px",
        }}
      >
        <h1>
          🍕 PizzaCraft Admin Dashboard
        </h1>

        <p
          style={{
            color: "#777",
          }}
        >
          Manage orders and inventory.
        </p>
      </div>

      {/* ===============================
          ORDERS
      =============================== */}

      <section>
        <h2>📦 Orders</h2>

        {loading ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "15px",
                background: "#fff",
              }}
            >
              <h3>
                Order #
                {order._id.slice(-8)}
              </h3>

              <p>
                <strong>Status:</strong>{" "}
                {order.status || "Pending"}
              </p>

              <p>
                <strong>Total:</strong> Rs.{" "}
                {order.totalAmount}
              </p>

              <p>
                <strong>
                  Customer:
                </strong>{" "}
                {order.user?.name ||
                  "Unknown"}
              </p>

              <p>
                <strong>Email:</strong>{" "}
                {order.user?.email ||
                  "N/A"}
              </p>

              <h4>Items:</h4>

              {order.items?.map(
                (item, index) => (
                  <p key={index}>
                    {item.emoji || "🍕"}{" "}
                    {item.name} ×{" "}
                    {item.quantity}
                  </p>
                )
              )}

              {/* UPDATE STATUS */}

              <div
                style={{
                  marginTop: "15px",
                }}
              >
                <label>
                  <strong>
                    Update Status:
                  </strong>
                </label>

                <select
                  value={
                    order.status ||
                    "Pending"
                  }
                  disabled={
                    updatingId ===
                    order._id
                  }
                  onChange={(e) =>
                    updateStatus(
                      order._id,
                      e.target.value
                    )
                  }
                  style={{
                    padding: "8px",
                    marginLeft: "8px",
                    borderRadius: "6px",
                  }}
                >
                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Confirmed">
                    Confirmed
                  </option>

                  <option value="Preparing">
                    Preparing
                  </option>

                  <option value="Out for Delivery">
                    Out for Delivery
                  </option>

                  <option value="Delivered">
                    Delivered
                  </option>

                  <option value="Cancelled">
                    Cancelled
                  </option>
                </select>

                {updatingId ===
                  order._id && (
                  <span
                    style={{
                      marginLeft: "10px",
                    }}
                  >
                    Updating...
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </section>

      {/* ===============================
          INVENTORY
      =============================== */}

      <section
        style={{
          marginTop: "50px",
        }}
      >
        <h2>📦 Inventory</h2>

        <p
          style={{
            color: "#777",
            marginBottom: "20px",
          }}
        >
          Manage pizza bases, sauces,
          cheeses and vegetables.
        </p>

        {/* ===============================
            INVENTORY SUMMARY
        =============================== */}

        {!inventoryLoading &&
          inventory.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "15px",
                marginBottom: "25px",
              }}
            >
              {/* TOTAL */}

              <div
                style={{
                  padding: "20px",
                  borderRadius: "14px",
                  background: "#f5f5f5",
                  border:
                    "1px solid #ddd",
                }}
              >
                <div
                  style={{
                    fontSize: "30px",
                  }}
                >
                  📦
                </div>

                <h3
                  style={{
                    margin:
                      "8px 0 4px",
                  }}
                >
                  {totalInventoryItems}
                </h3>

                <p
                  style={{
                    margin: 0,
                    color: "#777",
                  }}
                >
                  Total Items
                </p>
              </div>

              {/* IN STOCK */}

              <div
                style={{
                  padding: "20px",
                  borderRadius: "14px",
                  background: "#eefaf1",
                  border:
                    "1px solid #b7dfc1",
                }}
              >
                <div
                  style={{
                    fontSize: "30px",
                  }}
                >
                  🟢
                </div>

                <h3
                  style={{
                    margin:
                      "8px 0 4px",
                  }}
                >
                  {inStockItems}
                </h3>

                <p
                  style={{
                    margin: 0,
                    color: "#397347",
                  }}
                >
                  In Stock
                </p>
              </div>

              {/* LOW STOCK */}

              <div
                style={{
                  padding: "20px",
                  borderRadius: "14px",
                  background: "#fff8e6",
                  border:
                    "1px solid #f1d48a",
                }}
              >
                <div
                  style={{
                    fontSize: "30px",
                  }}
                >
                  🟡
                </div>

                <h3
                  style={{
                    margin:
                      "8px 0 4px",
                  }}
                >
                  {lowStockItems}
                </h3>

                <p
                  style={{
                    margin: 0,
                    color: "#9a7200",
                  }}
                >
                  Low Stock
                </p>
              </div>

              {/* OUT OF STOCK */}

              <div
                style={{
                  padding: "20px",
                  borderRadius: "14px",
                  background: "#fff0f0",
                  border:
                    "1px solid #efb1b1",
                }}
              >
                <div
                  style={{
                    fontSize: "30px",
                  }}
                >
                  🔴
                </div>

                <h3
                  style={{
                    margin:
                      "8px 0 4px",
                  }}
                >
                  {outOfStockItems}
                </h3>

                <p
                  style={{
                    margin: 0,
                    color: "#b73535",
                  }}
                >
                  Out of Stock
                </p>
              </div>
            </div>
          )}

        {/* ===============================
            ALERT
        =============================== */}

        {!inventoryLoading &&
          (lowStockItems > 0 ||
            outOfStockItems > 0) && (
            <div
              style={{
                padding: "16px 20px",
                marginBottom: "25px",
                borderRadius: "12px",
                background:
                  "#fff8e6",
                border:
                  "1px solid #f1d48a",
              }}
            >
              <strong>
                ⚠️ Inventory Alert
              </strong>

              <p
                style={{
                  margin:
                    "6px 0 0",
                  color: "#765d00",
                }}
              >
                {outOfStockItems >
                  0 &&
                  `${outOfStockItems} item(s) are out of stock. `}
                {lowStockItems >
                  0 &&
                  `${lowStockItems} item(s) are running low.`}
              </p>
            </div>
          )}

        {inventoryLoading ? (
          <p>
            Loading inventory...
          </p>
        ) : inventory.length ===
          0 ? (
          <p>
            No inventory items found.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "18px",
            }}
          >
            {inventory.map((item) => {
              const stock =
                Number(item.stock);

              const threshold =
                Number(
                  item.lowStockThreshold
                );

              const isOutOfStock =
                stock === 0;

              const isLowStock =
                stock > 0 &&
                stock <= threshold;

              return (
                <div
                  key={item._id}
                  style={{
                    border:
                      isOutOfStock
                        ? "2px solid #e74c3c"
                        : isLowStock
                        ? "2px solid #f1b600"
                        : "1px solid #ddd",

                    borderRadius:
                      "12px",

                    padding: "20px",

                    background:
                      isOutOfStock
                        ? "#fff7f7"
                        : isLowStock
                        ? "#fffdf5"
                        : "#fff",

                    boxShadow:
                      isOutOfStock ||
                      isLowStock
                        ? "0 4px 12px rgba(0,0,0,0.06)"
                        : "none",
                  }}
                >
                  <h3
                    style={{
                      marginTop: 0,
                    }}
                  >
                    {item.name}
                  </h3>

                  <p
                    style={{
                      color: "#777",
                    }}
                  >
                    Category:{" "}
                    {item.category}
                  </p>

                  {/* STOCK STATUS */}

                  <div
                    style={{
                      margin:
                        "15px 0",
                      padding: "12px",
                      borderRadius:
                        "10px",
                      background:
                        isOutOfStock
                          ? "#ffe8e8"
                          : isLowStock
                          ? "#fff3cd"
                          : "#edf8ef",
                    }}
                  >
                    <strong>
                      Current Stock:
                    </strong>{" "}
                    {stock}

                    <div
                      style={{
                        marginTop:
                          "5px",
                        fontWeight:
                          "700",
                        color:
                          isOutOfStock
                            ? "#c0392b"
                            : isLowStock
                            ? "#a97800"
                            : "#32834a",
                      }}
                    >
                      {isOutOfStock
                        ? "🔴 Out of Stock"
                        : isLowStock
                        ? "🟡 Low Stock"
                        : "🟢 In Stock"}
                    </div>
                  </div>

                  {/* STOCK */}

                  <div
                    style={{
                      marginTop:
                        "15px",
                    }}
                  >
                    <label
                      style={{
                        display:
                          "block",
                        fontWeight:
                          "700",
                        marginBottom:
                          "6px",
                      }}
                    >
                      Update Stock
                    </label>

                    <input
                      type="number"
                      min="0"
                      defaultValue={
                        item.stock
                      }
                      id={`stock-${item._id}`}
                      style={{
                        width:
                          "100%",
                        boxSizing:
                          "border-box",
                        padding:
                          "10px",
                        borderRadius:
                          "6px",
                        border:
                          "1px solid #ccc",
                        marginBottom:
                          "8px",
                      }}
                    />

                    <button
                      onClick={() => {
                        const input =
                          document.getElementById(
                            `stock-${item._id}`
                          );

                        updateStock(
                          item._id,
                          input.value
                        );
                      }}
                      disabled={
                        updatingStockId ===
                        item._id
                      }
                      style={{
                        width:
                          "100%",
                        padding:
                          "10px",
                        border: "none",
                        borderRadius:
                          "6px",
                        cursor:
                          "pointer",
                        background:
                          "#111",
                        color:
                          "#fff",
                      }}
                    >
                      {updatingStockId ===
                      item._id
                        ? "Updating..."
                        : "Save Stock"}
                    </button>
                  </div>

                  {/* THRESHOLD */}

                  <div
                    style={{
                      marginTop:
                        "18px",
                    }}
                  >
                    <label
                      style={{
                        display:
                          "block",
                        fontWeight:
                          "700",
                        marginBottom:
                          "6px",
                      }}
                    >
                      Low Stock Threshold
                    </label>

                    <input
                      type="number"
                      min="0"
                      defaultValue={
                        item.lowStockThreshold
                      }
                      id={`threshold-${item._id}`}
                      style={{
                        width:
                          "100%",
                        boxSizing:
                          "border-box",
                        padding:
                          "10px",
                        borderRadius:
                          "6px",
                        border:
                          "1px solid #ccc",
                        marginBottom:
                          "8px",
                      }}
                    />

                    <button
                      onClick={() => {
                        const input =
                          document.getElementById(
                            `threshold-${item._id}`
                          );

                        updateThreshold(
                          item._id,
                          input.value
                        );
                      }}
                      style={{
                        width:
                          "100%",
                        padding:
                          "10px",
                        border: "none",
                        borderRadius:
                          "6px",
                        cursor:
                          "pointer",
                        background:
                          "#eee",
                      }}
                    >
                      Save Threshold
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminDashboard;