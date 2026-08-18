import { useEffect, useMemo, useState } from "react";
import "./App.css";
import AdminDashboard from "./AdminDashboard";

const API_URL =
  "https://pizzacraft-delta.vercel.app";

/* =========================================================
   PIZZAS
========================================================= */

const pizzas = [
  {
    id: 1,
    name: "Classic Margherita",
    category: "Classic",
    price: 899,
    emoji: "🍕",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80",
    description:
      "Fresh mozzarella, tomato sauce and basil.",
  },
  {
    id: 2,
    name: "Pepperoni Feast",
    category: "Popular",
    price: 1199,
    emoji: "🍕",
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80",
    description:
      "Loaded with spicy pepperoni and melted cheese.",
  },
  {
    id: 3,
    name: "Chicken Tikka",
    category: "Chicken",
    price: 1299,
    emoji: "🍗",
    image:
      "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=800&q=80",
    description:
      "Tender chicken tikka with creamy cheese.",
  },
  {
    id: 4,
    name: "Creamy Chicken",
    category: "Chicken",
    price: 1399,
    emoji: "🍗",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
    description:
      "Creamy sauce, chicken and mozzarella cheese.",
  },
  {
    id: 5,
    name: "Veggie Supreme",
    category: "Veggie",
    price: 1099,
    emoji: "🥦",
    image:
      "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=800&q=80",
    description:
      "Fresh vegetables with herbs and mozzarella.",
  },
  {
    id: 6,
    name: "Cheese Lovers",
    category: "Classic",
    price: 1149,
    emoji: "🧀",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80",
    description:
      "A rich blend of delicious melted cheeses.",
  },
];

const categories = [
  "All",
  "Popular",
  "Classic",
  "Chicken",
  "Veggie",
];

/* =========================================================
   BUILDER OPTIONS
========================================================= */

const sizePrices = {
  Small: 0,
  Medium: 200,
  Large: 400,
};

const crustPrices = {
  "Classic Crust": 0,
  "Cheese Burst": 250,
  "Thin Crust": 100,
};

const saucePrices = {
  "Tomato Sauce": 0,
  "BBQ Sauce": 100,
  "Creamy Garlic": 150,
};

const cheesePrices = {
  Mozzarella: 0,
  "Extra Cheese": 180,
  "Cheddar Blend": 220,
};

const toppingOptions = [
  {
    name: "Pepperoni",
    price: 150,
    emoji: "🥩",
  },
  {
    name: "Chicken",
    price: 180,
    emoji: "🍗",
  },
  {
    name: "Mushrooms",
    price: 100,
    emoji: "🍄",
  },
  {
    name: "Olives",
    price: 80,
    emoji: "🫒",
  },
  {
    name: "Jalapeños",
    price: 80,
    emoji: "🌶️",
  },
  {
    name: "Onions",
    price: 60,
    emoji: "🧅",
  },
];

/* =========================================================
   SAFE JSON HELPER
========================================================= */

const getResponseData = async (response) => {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("Invalid JSON response:", text);

    throw new Error(
      `Server returned an invalid response (${response.status}).`
    );
  }
};

/* =========================================================
   APP
========================================================= */

function App() {
  /* =======================================================
     PAGE DETECTION
  ======================================================= */

  const currentPath = window.location.pathname;

  const isResetPasswordPage =
    currentPath === "/reset-password";

  const isVerifyEmailPage =
    currentPath === "/verify-email";

  const resetToken = new URLSearchParams(
    window.location.search
  ).get("token");

  /* =======================================================
     RESET PASSWORD
  ======================================================= */

  const [resetPassword, setResetPassword] =
    useState("");

  const [confirmResetPassword, setConfirmResetPassword] =
    useState("");

  const [resetLoading, setResetLoading] =
    useState(false);

  const [resetMessage, setResetMessage] =
    useState("");

  const [resetError, setResetError] =
    useState("");

  /* =======================================================
     MAIN STATES
  ======================================================= */

  const [activeCategory, setActiveCategory] =
    useState("All");

  const [builderOpen, setBuilderOpen] =
    useState(false);

  const [cart, setCart] =
    useState([]);

  const [cartOpen, setCartOpen] =
    useState(false);

  /* =======================================================
     AUTH
  ======================================================= */

  const [loginOpen, setLoginOpen] =
    useState(false);

  const [registerMode, setRegisterMode] =
    useState(false);

  const [isLoggedIn, setIsLoggedIn] =
    useState(() =>
      Boolean(
        localStorage.getItem("pizzaCraftToken")
      )
    );

  const [userName, setUserName] =
    useState("");

  const [userRole, setUserRole] =
    useState("");

  const [loginEmail, setLoginEmail] =
    useState("");

  const [loginPassword, setLoginPassword] =
    useState("");

  const [registerName, setRegisterName] =
    useState("");

  const [registerEmail, setRegisterEmail] =
    useState("");

  const [registerPassword, setRegisterPassword] =
    useState("");

  const [authLoading, setAuthLoading] =
    useState(false);

  /* =======================================================
     EMAIL VERIFICATION
  ======================================================= */

  const [resendEmail, setResendEmail] =
    useState("");

  const [resendLoading, setResendLoading] =
    useState(false);

  const [resendMessage, setResendMessage] =
    useState("");

  const [resendError, setResendError] =
    useState("");

  const [
    emailVerificationStatus,
    setEmailVerificationStatus,
  ] = useState("idle");

  const [
    emailVerificationMessage,
    setEmailVerificationMessage,
  ] = useState("");

  /* =======================================================
     BUILDER
  ======================================================= */

  const [size, setSize] =
    useState("Medium");

  const [crust, setCrust] =
    useState("Classic Crust");

  const [sauce, setSauce] =
    useState("Tomato Sauce");

  const [cheese, setCheese] =
    useState("Mozzarella");

  const [toppings, setToppings] =
    useState([]);

  /* =======================================================
     ORDERS / ADMIN / INVENTORY
  ======================================================= */

  const [myOrdersOpen, setMyOrdersOpen] =
    useState(false);

  const [adminOpen, setAdminOpen] =
    useState(false);

  const [inventoryOpen, setInventoryOpen] =
    useState(false);

  const [inventory, setInventory] =
    useState([]);

  const [inventoryLoading, setInventoryLoading] =
    useState(false);

  const [orders, setOrders] = useState(() => {
    try {
      return (
        JSON.parse(
          localStorage.getItem(
            "pizzaCraftOrders"
          )
        ) || []
      );
    } catch {
      return [];
    }
  });

  /* =========================================================
     LOAD USER
  ========================================================= */

  useEffect(() => {
    try {
      const savedUser = JSON.parse(
        localStorage.getItem(
          "pizzaCraftUser"
        )
      );

      if (savedUser) {
        setUserName(
          savedUser.name ||
            savedUser.username ||
            savedUser.email?.split("@")[0] ||
            ""
        );

        setUserRole(
          savedUser.role || ""
        );
      }
    } catch (error) {
      console.error(
        "Load saved user error:",
        error
      );

      setUserName("");
      setUserRole("");
    }
  }, []);

  /* =========================================================
     RESET PASSWORD
  ========================================================= */

  const handleResetPassword = async (
    event
  ) => {
    event.preventDefault();

    setResetMessage("");
    setResetError("");

    if (!resetToken) {
      setResetError(
        "Invalid or missing reset token."
      );
      return;
    }

    if (
      !resetPassword ||
      !confirmResetPassword
    ) {
      setResetError(
        "Please fill both password fields."
      );
      return;
    }

    if (resetPassword.length < 6) {
      setResetError(
        "Password must be at least 6 characters long."
      );
      return;
    }

    if (
      resetPassword !==
      confirmResetPassword
    ) {
      setResetError(
        "Passwords do not match."
      );
      return;
    }

    try {
      setResetLoading(true);

      const response = await fetch(
        `${API_URL}/api/auth/reset-password?token=${encodeURIComponent(
          resetToken
        )}`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            password: resetPassword,
          }),
        }
      );

      const data =
        await getResponseData(
          response
        );

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Unable to reset password."
        );
      }

      setResetMessage(
        data.message ||
          "Password reset successfully! You can now login."
      );

      setResetPassword("");
      setConfirmResetPassword("");
    } catch (error) {
      console.error(
        "Reset password error:",
        error
      );

      setResetError(
        error.message ||
          "Unable to reset password. Please try again."
      );
    } finally {
      setResetLoading(false);
    }
  };

  /* =========================================================
     EMAIL VERIFICATION
  ========================================================= */

  useEffect(() => {
    if (!isVerifyEmailPage) {
      return;
    }

    const params =
      new URLSearchParams(
        window.location.search
      );

    const token =
      params.get("token");

    if (!token) {
      setEmailVerificationStatus(
        "error"
      );

      setEmailVerificationMessage(
        "Verification token is missing."
      );

      return;
    }

    const verifyUserEmail =
      async () => {
        try {
          setEmailVerificationStatus(
            "loading"
          );

          const response =
            await fetch(
              `${API_URL}/api/auth/verify-email?token=${encodeURIComponent(
                token
              )}`,
              {
                method: "GET",
                headers: {
                  Accept:
                    "application/json",
                },
              }
            );

          const data =
            await getResponseData(
              response
            );

          if (
            !response.ok ||
            !data.success
          ) {
            throw new Error(
              data.message ||
                "Email verification failed."
            );
          }

          setEmailVerificationStatus(
            "success"
          );

          setEmailVerificationMessage(
            data.message ||
              "Email verified successfully. You can now login."
          );
        } catch (error) {
          console.error(
            "Email verification error:",
            error
          );

          setEmailVerificationStatus(
            "error"
          );

          setEmailVerificationMessage(
            error.message ||
              "Email verification failed."
          );
        }
      };

    verifyUserEmail();
  }, [isVerifyEmailPage]);

  /* =========================================================
     LOAD ORDERS
  ========================================================= */

  const loadMyOrders = async () => {
    try {
      const token =
        localStorage.getItem(
          "pizzaCraftToken"
        );

      if (!token) {
        return;
      }

      const response =
        await fetch(
          `${API_URL}/api/orders`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept:
                "application/json",
            },
          }
        );

      const data =
        await getResponseData(
          response
        );

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to load orders."
        );
      }

      const loadedOrders =
        data.orders || [];

      setOrders(
        loadedOrders
      );

      localStorage.setItem(
        "pizzaCraftOrders",
        JSON.stringify(
          loadedOrders
        )
      );
    } catch (error) {
      console.error(
        "Load orders error:",
        error
      );
    }
  };

  /* =========================================================
     LOAD ORDERS AFTER LOGIN
  ========================================================= */

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    loadMyOrders();
  }, [isLoggedIn]);

  /* =========================================================
     REAL-TIME ORDER STATUS
  ========================================================= */

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    const interval =
      setInterval(() => {
        loadMyOrders();
      }, 5000);

    return () =>
      clearInterval(interval);
  }, [isLoggedIn]);

  /* =========================================================
     INVENTORY
  ========================================================= */

  const loadInventory = async () => {
    try {
      setInventoryLoading(true);

      const token =
        localStorage.getItem(
          "pizzaCraftToken"
        );

      if (!token) {
        alert(
          "Please login again."
        );

        return;
      }

      const response =
        await fetch(
          `${API_URL}/api/inventory`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept:
                "application/json",
            },
          }
        );

      const data =
        await getResponseData(
          response
        );

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to load inventory."
        );
      }

      setInventory(
        data.inventory || []
      );
    } catch (error) {
      console.error(
        "Load inventory error:",
        error
      );

      alert(
        error.message ||
          "Failed to load inventory."
      );
    } finally {
      setInventoryLoading(false);
    }
  };

  /* =========================================================
     UPDATE STOCK
  ========================================================= */

  const updateInventoryStock =
    async (
      id,
      newStock
    ) => {
      try {
        const token =
          localStorage.getItem(
            "pizzaCraftToken"
          );

        if (!token) {
          alert(
            "Please login again."
          );
          return;
        }

        const stock =
          Number(newStock);

        if (
          Number.isNaN(stock) ||
          stock < 0
        ) {
          alert(
            "Please enter a valid stock value."
          );
          return;
        }

        const response =
          await fetch(
            `${API_URL}/api/inventory/${id}/stock`,
            {
              method: "PUT",
              headers: {
                "Content-Type":
                  "application/json",
                Authorization: `Bearer ${token}`,
                Accept:
                  "application/json",
              },
              body: JSON.stringify({
                stock,
              }),
            }
          );

        const data =
          await getResponseData(
            response
          );

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Failed to update stock."
          );
        }

        setInventory(
          (current) =>
            current.map(
              (item) =>
                item._id === id
                  ? data.item
                  : item
            )
        );

        alert(
          "Stock updated successfully."
        );
      } catch (error) {
        console.error(
          "Update stock error:",
          error
        );

        alert(
          error.message ||
            "Something went wrong while updating stock."
        );
      }
    };

  /* =========================================================
     UPDATE THRESHOLD
  ========================================================= */

  const updateInventoryThreshold =
    async (
      id,
      newThreshold
    ) => {
      try {
        const token =
          localStorage.getItem(
            "pizzaCraftToken"
          );

        if (!token) {
          alert(
            "Please login again."
          );
          return;
        }

        const lowStockThreshold =
          Number(newThreshold);

        if (
          Number.isNaN(
            lowStockThreshold
          ) ||
          lowStockThreshold < 0
        ) {
          alert(
            "Please enter a valid threshold."
          );
          return;
        }

        const response =
          await fetch(
            `${API_URL}/api/inventory/${id}/threshold`,
            {
              method: "PUT",
              headers: {
                "Content-Type":
                  "application/json",
                Authorization: `Bearer ${token}`,
                Accept:
                  "application/json",
              },
              body: JSON.stringify({
                lowStockThreshold,
              }),
            }
          );

        const data =
          await getResponseData(
            response
          );

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Failed to update threshold."
          );
        }

        setInventory(
          (current) =>
            current.map(
              (item) =>
                item._id === id
                  ? data.item
                  : item
            )
        );

        alert(
          "Low-stock threshold updated successfully."
        );
      } catch (error) {
        console.error(
          "Update threshold error:",
          error
        );

        alert(
          error.message ||
            "Something went wrong while updating threshold."
        );
      }
    };

  /* =========================================================
     FILTER PIZZAS
  ========================================================= */

  const filteredPizzas =
    useMemo(() => {
      if (
        activeCategory === "All"
      ) {
        return pizzas;
      }

      return pizzas.filter(
        (pizza) =>
          pizza.category ===
          activeCategory
      );
    }, [activeCategory]);

  /* =========================================================
     BUILDER PRICE
  ========================================================= */

  const builderPrice =
    useMemo(() => {
      const toppingsTotal =
        toppings.reduce(
          (total, toppingName) => {
            const topping =
              toppingOptions.find(
                (item) =>
                  item.name ===
                  toppingName
              );

            return (
              total +
              (topping?.price || 0)
            );
          },
          0
        );

      return (
        999 +
        sizePrices[size] +
        crustPrices[crust] +
        saucePrices[sauce] +
        cheesePrices[cheese] +
        toppingsTotal
      );
    }, [
      size,
      crust,
      sauce,
      cheese,
      toppings,
    ]);

  /* =========================================================
     NAVIGATION
  ========================================================= */

  const closeLargeSections =
    () => {
      setAdminOpen(false);
      setInventoryOpen(false);
      setMyOrdersOpen(false);
    };

  const scrollToSection =
    (id) => {
      closeLargeSections();

      setTimeout(() => {
        const element =
          document.getElementById(
            id
          );

        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 50);
    };

  const scrollToMenu = () => {
    setActiveCategory("All");
    scrollToSection("menu");
  };

  const openBuilder = () => {
    closeLargeSections();

    setBuilderOpen(true);

    setTimeout(() => {
      const element =
        document.querySelector(
          ".pizza-builder"
        );

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 50);
  };

  /* =========================================================
     AUTH HELPERS
  ========================================================= */

  const openLogin = () => {
    setRegisterMode(false);
    setLoginOpen(true);
  };

  const openRegister = () => {
    setRegisterMode(true);
    setLoginOpen(true);
  };

  const closeLogin = () => {
    setLoginOpen(false);

    setLoginEmail("");
    setLoginPassword("");

    setRegisterName("");
    setRegisterEmail("");
    setRegisterPassword("");
  };

  /* =========================================================
     REGISTER
  ========================================================= */

  const handleRegister =
    async (event) => {
      event.preventDefault();

      if (
        !registerName.trim() ||
        !registerEmail.trim() ||
        !registerPassword
      ) {
        alert(
          "Please fill all fields."
        );
        return;
      }

      if (
        registerPassword.length < 6
      ) {
        alert(
          "Password must be at least 6 characters long."
        );
        return;
      }

      try {
        setAuthLoading(true);

        const response =
          await fetch(
            `${API_URL}/api/auth/register`,
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
                Accept:
                  "application/json",
              },
              body: JSON.stringify({
                name:
                  registerName.trim(),
                email:
                  registerEmail
                    .trim()
                    .toLowerCase(),
                password:
                  registerPassword,
              }),
            }
          );

        const data =
          await getResponseData(
            response
          );

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Registration failed."
          );
        }

        alert(
          "Registration successful! Please check your email for verification."
        );

        setRegisterMode(false);

        setLoginEmail(
          registerEmail
            .trim()
            .toLowerCase()
        );

        setRegisterName("");
        setRegisterEmail("");
        setRegisterPassword("");
      } catch (error) {
        console.error(
          "Registration error:",
          error
        );

        alert(
          error.message ||
            "Registration failed."
        );
      } finally {
        setAuthLoading(false);
      }
    };

  /* =========================================================
     LOGIN
  ========================================================= */

  const handleLogin =
    async (event) => {
      event.preventDefault();

      if (
        !loginEmail.trim() ||
        !loginPassword
      ) {
        alert(
          "Please enter email and password."
        );
        return;
      }

      try {
        setAuthLoading(true);

        const response =
          await fetch(
            `${API_URL}/api/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
                Accept:
                  "application/json",
              },
              body: JSON.stringify({
                email:
                  loginEmail
                    .trim()
                    .toLowerCase(),
                password:
                  loginPassword,
              }),
            }
          );

        const data =
          await getResponseData(
            response
          );

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Login failed."
          );
        }

        if (data.token) {
          localStorage.setItem(
            "pizzaCraftToken",
            data.token
          );
        }

        if (data.user) {
          localStorage.setItem(
            "pizzaCraftUser",
            JSON.stringify(
              data.user
            )
          );

          setUserName(
            data.user.name ||
              data.user.username ||
              data.user.email?.split(
                "@"
              )[0] ||
              ""
          );

          setUserRole(
            data.user.role || ""
          );
        }

        setIsLoggedIn(true);

        closeLogin();

        alert(
          "Login successful! Welcome to PizzaCraft 🍕"
        );

        await loadMyOrders();
      } catch (error) {
        console.error(
          "Login error:",
          error
        );

        alert(
          error.message ||
            "Login failed."
        );
      } finally {
        setAuthLoading(false);
      }
    };

  /* =========================================================
     RESEND VERIFICATION
  ========================================================= */

  const handleResendVerification =
    async () => {
      const email =
        resendEmail.trim();

      if (!email) {
        setResendError(
          "Please enter your email address."
        );

        setResendMessage("");
        return;
      }

      try {
        setResendLoading(true);
        setResendError("");
        setResendMessage("");

        const response =
          await fetch(
            `${API_URL}/api/auth/resend-verification`,
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
                Accept:
                  "application/json",
              },
              body: JSON.stringify({
                email:
                  email.toLowerCase(),
              }),
            }
          );

        const data =
          await getResponseData(
            response
          );

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Unable to resend verification email."
          );
        }

        setResendMessage(
          data.message ||
            "Verification email sent successfully. Please check your inbox."
        );
      } catch (error) {
        console.error(
          "Resend verification error:",
          error
        );

        setResendError(
          error.message ||
            "Unable to resend verification email."
        );
      } finally {
        setResendLoading(false);
      }
    };

  /* =========================================================
     FORGOT PASSWORD
  ========================================================= */

  const handleForgotPassword =
    async () => {
      const email =
        loginEmail.trim();

      if (!email) {
        alert(
          "Please enter your email first."
        );
        return;
      }

      try {
        const response =
          await fetch(
            `${API_URL}/api/auth/forgot-password`,
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
                Accept:
                  "application/json",
              },
              body: JSON.stringify({
                email:
                  email.toLowerCase(),
              }),
            }
          );

        const data =
          await getResponseData(
            response
          );

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Unable to send reset email."
          );
        }

        alert(
          data.message ||
            "Password reset email sent successfully."
        );
      } catch (error) {
        console.error(
          "Forgot password error:",
          error
        );

        alert(
          error.message ||
            "Unable to send reset email."
        );
      }
    };

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = () => {
    localStorage.removeItem(
      "pizzaCraftToken"
    );

    localStorage.removeItem(
      "pizzaCraftUser"
    );

    setIsLoggedIn(false);
    setUserName("");
    setUserRole("");

    setAdminOpen(false);
    setInventoryOpen(false);
    setMyOrdersOpen(false);
    setCartOpen(false);

    alert(
      "You have been logged out."
    );
  };

  /* =========================================================
     LOGIN REQUIRED
  ========================================================= */

  const requireLogin = (
    callback
  ) => {
    if (!isLoggedIn) {
      alert(
        "Please login first to continue."
      );

      openLogin();
      return;
    }

    callback();
  };

  /* =========================================================
     CART
  ========================================================= */

  const addPizzaToCart = (
    pizza
  ) => {
    requireLogin(() => {
      setCart(
        (currentCart) => {
          const existing =
            currentCart.find(
              (item) =>
                item.id ===
                pizza.id
            );

          if (existing) {
            return currentCart.map(
              (item) =>
                item.id ===
                pizza.id
                  ? {
                      ...item,
                      quantity:
                        item.quantity +
                        1,
                    }
                  : item
            );
          }

          return [
            ...currentCart,
            {
              ...pizza,
              quantity: 1,
            },
          ];
        }
      );

      alert(
        `${pizza.name} added to cart 🍕`
      );
    });
  };

  const addToOrder = () => {
    requireLogin(() => {
      const customPizza = {
        id: `custom-${Date.now()}`,
        name: "My Custom Pizza",
        category: "Custom",
        price: builderPrice,
        emoji: "🍕",
        quantity: 1,
        customization: {
          size,
          crust,
          sauce,
          cheese,
          toppings,
        },
      };

      setCart(
        (currentCart) => [
          ...currentCart,
          customPizza,
        ]
      );

      setBuilderOpen(false);

      setTimeout(() => {
        setCartOpen(true);
      }, 100);
    });
  };

  const openCart = () => {
    requireLogin(() => {
      setCartOpen(true);
    });
  };

  const increaseQuantity = (
    id
  ) => {
    setCart(
      (currentCart) =>
        currentCart.map(
          (item) =>
            item.id === id
              ? {
                  ...item,
                  quantity:
                    item.quantity +
                    1,
                }
              : item
        )
    );
  };

  const decreaseQuantity = (
    id
  ) => {
    setCart(
      (currentCart) =>
        currentCart
          .map((item) =>
            item.id === id
              ? {
                  ...item,
                  quantity:
                    item.quantity -
                    1,
                }
              : item
          )
          .filter(
            (item) =>
              item.quantity > 0
          )
    );
  };

  const removeFromCart = (
    id
  ) => {
    setCart(
      (currentCart) =>
        currentCart.filter(
          (item) =>
            item.id !== id
        )
    );
  };

  const cartTotal =
    cart.reduce(
      (total, item) =>
        total +
        Number(item.price || 0) *
          Number(item.quantity || 0),
      0
    );

  const cartItemsCount =
    cart.reduce(
      (total, item) =>
        total +
        Number(item.quantity || 0),
      0
    );

  /* =========================================================
     CHECKOUT
  ========================================================= */

  const handleCheckout =
    async () => {
      if (!isLoggedIn) {
        alert(
          "Please login first to continue."
        );

        openLogin();
        return;
      }

      if (cart.length === 0) {
        alert(
          "Your cart is empty."
        );
        return;
      }

      try {
        const token =
          localStorage.getItem(
            "pizzaCraftToken"
          );

        if (!token) {
          alert(
            "Session expired. Please login again."
          );

          handleLogout();
          return;
        }

        /* -----------------------------------------------
           CREATE DEMO PAYMENT
        ------------------------------------------------ */

        const paymentResponse =
          await fetch(
            `${API_URL}/api/payment/create-order`,
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
                Authorization: `Bearer ${token}`,
                Accept:
                  "application/json",
              },
              body: JSON.stringify({
                amount:
                  Number(cartTotal),
              }),
            }
          );

        const paymentData =
          await getResponseData(
            paymentResponse
          );

        if (
          !paymentResponse.ok ||
          !paymentData.success
        ) {
          throw new Error(
            paymentData.message ||
              "Unable to create payment order."
          );
        }

        const paymentOrder =
          paymentData.order;

        if (!paymentOrder?.id) {
          throw new Error(
            "Payment order ID was not returned by the server."
          );
        }

        /* -----------------------------------------------
           DEMO PAYMENT CONFIRMATION
        ------------------------------------------------ */

        const confirmPayment =
          window.confirm(
            `Demo Payment\n\nAmount: Rs. ${cartTotal}\n\nClick OK to complete the demo payment.`
          );

        if (!confirmPayment) {
          alert(
            "Payment cancelled."
          );
          return;
        }

        alert(
          `Payment successful! ✅\n\nPayment ID: ${paymentOrder.id}`
        );

        /* -----------------------------------------------
           PREPARE ORDER ITEMS
        ------------------------------------------------ */

        const orderItems =
          cart.map((item) => ({
            name: item.name,
            description:
              item.description || "",
            price: Number(
              item.price || 0
            ),
            quantity: Number(
              item.quantity || 1
            ),
            emoji:
              item.emoji || "🍕",
            customization:
              item.customization || {},
          }));

        /* -----------------------------------------------
           CREATE ORDER
        ------------------------------------------------ */

        const orderResponse =
          await fetch(
            `${API_URL}/api/orders`,
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
                Authorization: `Bearer ${token}`,
                Accept:
                  "application/json",
              },
              body: JSON.stringify({
                items: orderItems,
                totalAmount:
                  Number(cartTotal),
                paymentStatus:
                  "paid",
                paymentId:
                  paymentOrder.id,
                paymentMethod:
                  "Demo Payment",
              }),
            }
          );

        const orderData =
          await getResponseData(
            orderResponse
          );

        if (
          !orderResponse.ok ||
          !orderData.success
        ) {
          throw new Error(
            orderData.message ||
              "Payment succeeded but order could not be created."
          );
        }

        if (orderData.order) {
          setOrders(
            (currentOrders) => {
              const updatedOrders = [
                orderData.order,
                ...currentOrders,
              ];

              localStorage.setItem(
                "pizzaCraftOrders",
                JSON.stringify(
                  updatedOrders
                )
              );

              return updatedOrders;
            }
          );
        }

        setCart([]);
        setCartOpen(false);

        alert(
          `Order placed successfully! 🍕\n\nOrder ID: ${String(
            orderData.order?._id ||
              "N/A"
          ).slice(-8)}`
        );

        await loadMyOrders();

        setMyOrdersOpen(true);
      } catch (error) {
        console.error(
          "Checkout/payment error:",
          error
        );

        alert(
          error.message ||
            "Something went wrong during checkout."
        );
      }
    };

  /* =========================================================
     TOPPINGS
  ========================================================= */

  const toggleTopping = (
    toppingName
  ) => {
    setToppings(
      (current) =>
        current.includes(
          toppingName
        )
          ? current.filter(
              (item) =>
                item !==
                toppingName
            )
          : [
              ...current,
              toppingName,
            ]
    );
  };

  /* =========================================================
     RESET PASSWORD PAGE
  ========================================================= */

  if (isResetPasswordPage) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="reset-password-logo">
            🍕
          </div>

          <h2>
            Reset Password 🔐
          </h2>

          <p>
            Create a new password for
            your PizzaCraft account.
          </p>

          <form
            onSubmit={
              handleResetPassword
            }
          >
            <input
              type="password"
              placeholder="New Password"
              value={
                resetPassword
              }
              onChange={(event) =>
                setResetPassword(
                  event.target.value
                )
              }
              required
              minLength={6}
            />

            <input
              type="password"
              placeholder="Confirm New Password"
              value={
                confirmResetPassword
              }
              onChange={(event) =>
                setConfirmResetPassword(
                  event.target.value
                )
              }
              required
              minLength={6}
            />

            {resetError && (
              <p className="error-message">
                {resetError}
              </p>
            )}

            {resetMessage && (
              <p className="success-message">
                {resetMessage}
              </p>
            )}

            <button
              className="primary-btn"
              type="submit"
              disabled={
                resetLoading
              }
            >
              {resetLoading
                ? "Resetting..."
                : "Reset Password"}
            </button>
          </form>

          {resetMessage && (
            <button
              type="button"
              className="secondary-btn"
              onClick={() => {
                window.history.pushState(
                  {},
                  "",
                  "/"
                );

                window.location.reload();
              }}
            >
              Back to Login
            </button>
          )}
        </div>
      </div>
    );
  }

  /* =========================================================
     EMAIL VERIFICATION PAGE
  ========================================================= */

  if (isVerifyEmailPage) {
    return (
      <section className="about-section email-verification-page">
        <div className="about-content">
          <div className="hero-badge">
            PIZZACRAFT • EMAIL VERIFICATION
          </div>

          {emailVerificationStatus ===
            "loading" && (
            <>
              <div className="empty-icon">
                📧
              </div>

              <h2>
                Verifying your email...
              </h2>

              <p>
                Please wait while we
                securely verify your
                PizzaCraft account.
              </p>
            </>
          )}

          {emailVerificationStatus ===
            "success" && (
            <>
              <div className="empty-icon">
                🎉
              </div>

              <h2>
                Email Verified Successfully!
              </h2>

              <p>
                {
                  emailVerificationMessage
                }
              </p>

              <button
                className="primary-btn"
                onClick={() => {
                  window.history.pushState(
                    {},
                    "",
                    "/"
                  );

                  window.location.reload();
                }}
              >
                Login to PizzaCraft →
              </button>
            </>
          )}

          {emailVerificationStatus ===
            "error" && (
            <>
              <div className="empty-icon">
                ⚠️
              </div>

              <h2>
                Verification Failed
              </h2>

              <p>
                {
                  emailVerificationMessage
                }
              </p>

              <div className="resend-verification-box">
                <h3>
                  Didn't receive a valid email?
                </h3>

                <p>
                  Enter your registered
                  email address and we'll
                  send you a new
                  verification link.
                </p>

                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={
                    resendEmail
                  }
                  onChange={(event) => {
                    setResendEmail(
                      event.target.value
                    );

                    setResendError("");
                    setResendMessage("");
                  }}
                />

                {resendError && (
                  <div className="reset-error">
                    {resendError}
                  </div>
                )}

                {resendMessage && (
                  <div className="reset-success">
                    {resendMessage}
                  </div>
                )}

                <button
                  className="primary-btn"
                  type="button"
                  onClick={
                    handleResendVerification
                  }
                  disabled={
                    resendLoading
                  }
                >
                  {resendLoading
                    ? "Sending..."
                    : "📧 Resend Verification Email"}
                </button>
              </div>

              <button
                className="secondary-btn"
                onClick={() => {
                  window.history.pushState(
                    {},
                    "",
                    "/"
                  );

                  window.location.reload();
                }}
              >
                Back to PizzaCraft
              </button>
            </>
          )}
        </div>
      </section>
    );
  }

  /* =========================================================
     USER ORDERS
  ========================================================= */

  const userOrders = orders;

  /* =========================================================
     MAIN RETURN
  ========================================================= */

  return (
    <div className="app">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav className="navbar">
        <button
          className="logo"
          onClick={() =>
            scrollToSection("home")
          }
        >
          <span>P</span>
          Pizza
          <span>Craft</span>
        </button>

        <div className="nav-links">
          <button
            onClick={() =>
              scrollToSection("home")
            }
          >
            Home
          </button>

          <button
            onClick={scrollToMenu}
          >
            Menu
          </button>

          <button
            onClick={openBuilder}
          >
            Custom Pizza
          </button>

          <button
            onClick={() =>
              scrollToSection("about")
            }
          >
            About
          </button>
        </div>

        <div className="navbar-actions">
          {!isLoggedIn ? (
            <>
              <button
                className="secondary-btn nav-login-btn"
                onClick={openLogin}
              >
                Login
              </button>

              <button
                className="primary-btn nav-register-btn"
                onClick={openRegister}
              >
                Register
              </button>
            </>
          ) : (
            <>
              <button
                className="nav-user-btn"
                onClick={() =>
                  setMyOrdersOpen(true)
                }
              >
                👤{" "}
                {userName ||
                  "Account"}
              </button>

              <button
                className="nav-orders-btn"
                onClick={() => {
                  loadMyOrders();
                  setMyOrdersOpen(true);
                }}
              >
                📦 My Orders
              </button>

              {userRole ===
                "admin" && (
                <>
                  <button
                    className="nav-admin-btn"
                    onClick={() =>
                      setAdminOpen(true)
                    }
                  >
                    👑 Admin Orders
                  </button>

                  <button
                    className="nav-inventory-btn"
                    onClick={() => {
                      loadInventory();
                      setInventoryOpen(
                        true
                      );
                    }}
                  >
                    📦 Inventory
                  </button>
                </>
              )}

              <button
                className="nav-cart-btn"
                onClick={openCart}
              >
                🛒
                <span className="cart-count">
                  {cartItemsCount}
                </span>
              </button>

              <button
                className="nav-logout-btn"
                onClick={
                  handleLogout
                }
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section
        className="hero-section"
        id="home"
      >
        <div className="hero-content">
          <div className="hero-badge">
            🍕 FRESH • HOT • MADE FOR YOU
          </div>

          <h1>
            Your perfect
            <br />
            pizza,{" "}
            <span>crafted</span>
            <br />
            your way.
          </h1>

          <p>
            Choose from our signature
            pizzas or build your own
            masterpiece with fresh
            ingredients and bold
            flavors.
          </p>

          <div className="hero-buttons">
            <button
              className="primary-btn"
              onClick={
                scrollToMenu
              }
            >
              Explore Menu →
            </button>

            <button
              className="secondary-btn"
              onClick={
                openBuilder
              }
            >
              Build Your Pizza
            </button>
          </div>
        </div>

        <div className="hero-pizza">
          <div className="pizza-visual">
            <div className="hero-pizza-art">
              🍕
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          MENU
      ===================================================== */}

      <section
        className="categories-section"
        id="menu"
      >
        <div className="section-heading">
          <div className="hero-badge">
            OUR MENU
          </div>

          <h2>
            Explore Our Menu
          </h2>

          <p>
            Pick your favourite pizza
            and make it yours.
          </p>
        </div>

        <div className="category-list">
          {categories.map(
            (category) => (
              <button
                key={category}
                className={`category-btn ${
                  activeCategory ===
                  category
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setActiveCategory(
                    category
                  )
                }
              >
                {category}
              </button>
            )
          )}
        </div>
      </section>

      {/* =====================================================
          PIZZA GRID
      ===================================================== */}

      <section className="pizza-section">
        <div className="pizza-grid">
          {filteredPizzas.map(
            (pizza) => (
              <div
                className="pizza-card"
                key={pizza.id}
              >
                <div className="pizza-image">
                  <img
                    src={pizza.image}
                    alt={pizza.name}
                  />
                </div>

                <div className="pizza-info">
                  <h3>
                    {pizza.name}
                  </h3>

                  <p>
                    {pizza.description}
                  </p>

                  <div className="pizza-bottom">
                    <span className="price">
                      Rs.{" "}
                      {pizza.price}
                    </span>

                    <button
                      className="add-btn"
                      onClick={() =>
                        addPizzaToCart(
                          pizza
                        )
                      }
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </section>

      {/* =====================================================
          CUSTOM PIZZA INTRO
      ===================================================== */}

      <section className="builder-preview">
        <div className="builder-preview-inner">
          <div>
            <div className="hero-badge">
              PIZZA BUILDER
            </div>

            <h2>
              Create your own{" "}
              <span>
                perfect pizza.
              </span>
            </h2>

            <p>
              Choose your size, crust,
              sauce, cheese and favourite
              toppings. Your pizza, exactly
              the way you want it.
            </p>

            <button
              className="primary-btn"
              onClick={
                openBuilder
              }
            >
              Start Building 🍕
            </button>
          </div>

          <div className="builder-steps">
            <div>
              <span>01</span>
              <strong>
                Choose Size
              </strong>
              <small>
                Small, medium or large.
              </small>
            </div>

            <div>
              <span>02</span>
              <strong>
                Pick Your Crust
              </strong>
              <small>
                Classic, thin or cheese burst.
              </small>
            </div>

            <div>
              <span>03</span>
              <strong>
                Add Toppings
              </strong>
              <small>
                Make it uniquely yours.
              </small>
            </div>

            <div>
              <span>04</span>
              <strong>
                Enjoy
              </strong>
              <small>
                Freshly prepared for you.
              </small>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          BUILDER
      ===================================================== */}

      {builderOpen && (
        <section className="pizza-builder">
          <div className="section-heading builder-heading">
            <div className="hero-badge">
              CUSTOM PIZZA
            </div>

            <h2>
              Build Your Dream Pizza
            </h2>

            <p>
              Select every detail and
              create something delicious.
            </p>
          </div>

          {/* SIZE */}

          <div className="builder-group">
            <h3>
              Choose Size
            </h3>

            <div className="builder-options">
              {Object.keys(
                sizePrices
              ).map((item) => (
                <button
                  type="button"
                  key={item}
                  className={`builder-option ${
                    size === item
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    setSize(item)
                  }
                >
                  <strong>
                    {item}
                  </strong>

                  <span>
                    {sizePrices[item] ===
                    0
                      ? "Base price"
                      : `+ Rs. ${sizePrices[item]}`}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* CRUST */}

          <div className="builder-group">
            <h3>
              Choose Crust
            </h3>

            <div className="builder-options">
              {Object.keys(
                crustPrices
              ).map((item) => (
                <button
                  type="button"
                  key={item}
                  className={`builder-option ${
                    crust === item
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    setCrust(item)
                  }
                >
                  <strong>
                    {item}
                  </strong>

                  <span>
                    {crustPrices[item] ===
                    0
                      ? "Included"
                      : `+ Rs. ${crustPrices[item]}`}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* SAUCE */}

          <div className="builder-group">
            <h3>
              Choose Sauce
            </h3>

            <div className="builder-options">
              {Object.keys(
                saucePrices
              ).map((item) => (
                <button
                  type="button"
                  key={item}
                  className={`builder-option ${
                    sauce === item
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    setSauce(item)
                  }
                >
                  <strong>
                    {item}
                  </strong>

                  <span>
                    {saucePrices[item] ===
                    0
                      ? "Included"
                      : `+ Rs. ${saucePrices[item]}`}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* CHEESE */}

          <div className="builder-group">
            <h3>
              Choose Cheese
            </h3>

            <div className="builder-options">
              {Object.keys(
                cheesePrices
              ).map((item) => (
                <button
                  type="button"
                  key={item}
                  className={`builder-option ${
                    cheese === item
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    setCheese(item)
                  }
                >
                  <strong>
                    {item}
                  </strong>

                  <span>
                    {cheesePrices[item] ===
                    0
                      ? "Included"
                      : `+ Rs. ${cheesePrices[item]}`}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* TOPPINGS */}

          <div className="builder-group">
            <h3>
              Add Toppings
            </h3>

            <div className="builder-options">
              {toppingOptions.map(
                (topping) => (
                  <button
                    type="button"
                    key={
                      topping.name
                    }
                    className={`builder-option ${
                      toppings.includes(
                        topping.name
                      )
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      toggleTopping(
                        topping.name
                      )
                    }
                  >
                    <span>
                      {
                        topping.emoji
                      }
                    </span>

                    <strong>
                      {
                        topping.name
                      }
                    </strong>

                    <span>
                      + Rs.{" "}
                      {
                        topping.price
                      }
                    </span>
                  </button>
                )
              )}
            </div>
          </div>

          {/* SUMMARY */}

          <div className="builder-group builder-summary">
            <div>
              <div className="hero-badge">
                YOUR CREATION
              </div>

              <h3>
                {size}{" "}
                {crust} Pizza
              </h3>

              <p>
                {sauce} •{" "}
                {cheese}

                {toppings.length >
                  0 &&
                  ` • ${toppings.join(
                    ", "
                  )}`}
              </p>
            </div>

            <div className="builder-total">
              <span>
                Total
              </span>

              <strong>
                Rs.{" "}
                {builderPrice}
              </strong>

              <button
                className="primary-btn"
                onClick={
                  addToOrder
                }
              >
                Add to Cart
              </button>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          ABOUT
      ===================================================== */}

      <section
        id="about"
        className="about-section"
      >
        <div className="about-content">
          <div className="hero-badge">
            ABOUT PIZZACRAFT
          </div>

          <h2>
            Pizza made your way.
          </h2>

          <p>
            PizzaCraft brings fresh
            ingredients, bold flavours
            and complete customization
            together in one simple pizza
            experience. Choose a signature
            pizza or create your own
            masterpiece from scratch.
          </p>
        </div>
      </section>

      {/* =====================================================
          CART
      ===================================================== */}

      {cartOpen && (
        <div
          className="cart-overlay"
          onClick={() =>
            setCartOpen(false)
          }
        >
          <div
            className="cart-panel"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="modal-header">
              <h2>
                Your Cart 🛒
              </h2>

              <button
                className="close-btn"
                type="button"
                onClick={() =>
                  setCartOpen(false)
                }
              >
                ×
              </button>
            </div>

            {cart.length ===
            0 ? (
              <div className="cart-empty">
                <div className="empty-icon">
                  🍕
                </div>

                <h3>
                  Your cart is empty
                </h3>

                <p>
                  Add some delicious
                  pizzas to get started.
                </p>

                <button
                  className="primary-btn"
                  onClick={() => {
                    setCartOpen(
                      false
                    );

                    scrollToMenu();
                  }}
                >
                  Explore Menu
                </button>
              </div>
            ) : (
              <>
                {cart.map(
                  (
                    item,
                    index
                  ) => (
                    <div
                      className="cart-item"
                      key={`${item.id}-${index}`}
                    >
                      <div className="cart-item-image">
                        {item.emoji}
                      </div>

                      <div className="cart-item-info">
                        <h4>
                          {item.name}
                        </h4>

                        <p>
                          Rs.{" "}
                          {item.price}
                        </p>

                        {item.customization && (
                          <small>
                            {
                              item
                                .customization
                                .size
                            }{" "}
                            •{" "}
                            {
                              item
                                .customization
                                .crust
                            }
                          </small>
                        )}
                      </div>

                      <div className="quantity-controls">
                        <button
                          type="button"
                          className="quantity-btn"
                          onClick={() =>
                            decreaseQuantity(
                              item.id
                            )
                          }
                        >
                          −
                        </button>

                        <strong>
                          {
                            item.quantity
                          }
                        </strong>

                        <button
                          type="button"
                          className="quantity-btn"
                          onClick={() =>
                            increaseQuantity(
                              item.id
                            )
                          }
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        className="close-btn"
                        onClick={() =>
                          removeFromCart(
                            item.id
                          )
                        }
                      >
                        ×
                      </button>
                    </div>
                  )
                )}

                <div className="cart-total">
                  <div>
                    <strong>
                      Total
                    </strong>

                    <strong>
                      Rs.{" "}
                      {cartTotal}
                    </strong>
                  </div>

                  <button
                    className="primary-btn"
                    onClick={
                      handleCheckout
                    }
                  >
                    Place Order →
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* =====================================================
          LOGIN / REGISTER
      ===================================================== */}

      {loginOpen && (
        <div
          className="login-overlay"
          onClick={closeLogin}
        >
          <div
            className="login-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="modal-header">
              <h2>
                {registerMode
                  ? "Create Account"
                  : "Welcome Back"}
              </h2>

              <button
                className="close-btn"
                type="button"
                onClick={closeLogin}
              >
                ×
              </button>
            </div>

            {registerMode ? (
              <form
                onSubmit={
                  handleRegister
                }
              >
                <input
                  type="text"
                  placeholder="Full Name"
                  value={
                    registerName
                  }
                  onChange={(event) =>
                    setRegisterName(
                      event.target.value
                    )
                  }
                  required
                />

                <input
                  type="email"
                  placeholder="Email Address"
                  value={
                    registerEmail
                  }
                  onChange={(event) =>
                    setRegisterEmail(
                      event.target.value
                    )
                  }
                  required
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={
                    registerPassword
                  }
                  onChange={(event) =>
                    setRegisterPassword(
                      event.target.value
                    )
                  }
                  minLength={6}
                  required
                />

                <button
                  className="primary-btn"
                  type="submit"
                  disabled={
                    authLoading
                  }
                >
                  {authLoading
                    ? "Creating Account..."
                    : "Create Account"}
                </button>

                <p className="auth-switch">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setRegisterMode(
                        false
                      );

                      setLoginEmail(
                        registerEmail
                      );

                      setRegisterName(
                        ""
                      );

                      setRegisterEmail(
                        ""
                      );

                      setRegisterPassword(
                        ""
                      );
                    }}
                  >
                    Login
                  </button>
                </p>
              </form>
            ) : (
              <form
                onSubmit={
                  handleLogin
                }
              >
                <input
                  type="email"
                  placeholder="Email Address"
                  value={
                    loginEmail
                  }
                  onChange={(event) =>
                    setLoginEmail(
                      event.target.value
                    )
                  }
                  required
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={
                    loginPassword
                  }
                  onChange={(event) =>
                    setLoginPassword(
                      event.target.value
                    )
                  }
                  required
                />

                <button
                  type="button"
                  className="forgot-password-btn"
                  onClick={
                    handleForgotPassword
                  }
                >
                  Forgot Password?
                </button>

                <button
                  className="primary-btn"
                  type="submit"
                  disabled={
                    authLoading
                  }
                >
                  {authLoading
                    ? "Logging in..."
                    : "Login"}
                </button>

                <p className="auth-switch">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setRegisterMode(
                        true
                      );

                      setLoginPassword(
                        ""
                      );
                    }}
                  >
                    Register
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      )}

      {/* =====================================================
          MY ORDERS
      ===================================================== */}

      {myOrdersOpen && (
        <div
          className="login-overlay"
          onClick={() =>
            setMyOrdersOpen(false)
          }
        >
          <div
            className="login-modal orders-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="modal-header">
              <h2>
                My Orders 📦
              </h2>

              <button
                className="close-btn"
                type="button"
                onClick={() =>
                  setMyOrdersOpen(
                    false
                  )
                }
              >
                ×
              </button>
            </div>

            {userOrders.length ===
            0 ? (
              <div className="cart-empty">
                <div className="empty-icon">
                  📦
                </div>

                <h3>
                  No orders yet
                </h3>

                <p>
                  Your placed orders
                  will appear here.
                </p>
              </div>
            ) : (
              <div>
                {userOrders
                  .slice()
                  .reverse()
                  .map((order) => {
                    const trackingSteps =
                      [
                        "Pending",
                        "Confirmed",
                        "Preparing",
                        "Out for Delivery",
                        "Delivered",
                      ];

                    const currentStep =
                      trackingSteps.indexOf(
                        order.status
                      );

                    const isCancelled =
                      order.status ===
                      "Cancelled";

                    return (
                      <div
                        key={
                          order._id
                        }
                        className={`order-card ${
                          isCancelled
                            ? "order-cancelled"
                            : ""
                        }`}
                      >
                        <div className="order-top">
                          <div>
                            <strong>
                              #
                              {order._id
                                ?.toString()
                                .slice(
                                  -8
                                )}
                            </strong>

                            <small>
                              {order.createdAt
                                ? new Date(
                                    order.createdAt
                                  ).toLocaleDateString()
                                : ""}
                            </small>
                          </div>

                          <span
                            className={`order-status ${
                              order.status
                                ?.toLowerCase()
                                .replace(
                                  /\s+/g,
                                  "-"
                                )
                            }`}
                          >
                            {
                              order.status
                            }
                          </span>
                        </div>

                        <div className="order-summary">
                          <span>
                            {
                              order
                                .items
                                ?.length || 0
                            }{" "}
                            item(s)
                          </span>

                          <strong className="order-price">
                            Rs.{" "}
                            {
                              order.totalAmount
                            }
                          </strong>
                        </div>

                        {isCancelled ? (
                          <div className="cancelled-order-message">
                            <span className="tracking-icon">
                              ✕
                            </span>

                            <div>
                              <strong>
                                Order Cancelled
                              </strong>

                              <small>
                                This order
                                has been
                                cancelled.
                              </small>
                            </div>
                          </div>
                        ) : (
                          <div className="order-tracking">
                            {trackingSteps.map(
                              (
                                step,
                                index
                              ) => {
                                const completed =
                                  currentStep >=
                                  index;

                                const active =
                                  currentStep ===
                                  index;

                                return (
                                  <div
                                    key={
                                      step
                                    }
                                    className={`tracking-step ${
                                      completed
                                        ? "completed"
                                        : ""
                                    } ${
                                      active
                                        ? "active"
                                        : ""
                                    }`}
                                  >
                                    <div className="tracking-circle">
                                      {completed
                                        ? "✓"
                                        : index +
                                          1}
                                    </div>

                                    <span>
                                      {
                                        step
                                      }
                                    </span>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================
          ADMIN
      ===================================================== */}

      {adminOpen &&
        userRole === "admin" && (
          <div
            className="login-overlay"
            onClick={() =>
              setAdminOpen(false)
            }
          >
            <div
              className="login-modal admin-modal"
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              <AdminDashboard />
            </div>
          </div>
        )}

      {/* =====================================================
          INVENTORY
      ===================================================== */}

      {inventoryOpen &&
        userRole === "admin" && (
          <div
            className="login-overlay"
            onClick={() =>
              setInventoryOpen(false)
            }
          >
            <div
              className="login-modal inventory-modal"
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              <div className="modal-header">
                <div>
                  <h2>
                    Inventory 📦
                  </h2>

                  <p className="inventory-subtitle">
                    Manage stock and
                    low-stock thresholds
                  </p>
                </div>

                <button
                  className="close-btn"
                  type="button"
                  onClick={() =>
                    setInventoryOpen(
                      false
                    )
                  }
                >
                  ×
                </button>
              </div>

              <div className="inventory-header-actions">
                <button
                  className="secondary-btn"
                  onClick={
                    loadInventory
                  }
                  disabled={
                    inventoryLoading
                  }
                >
                  {inventoryLoading
                    ? "Refreshing..."
                    : "↻ Refresh"}
                </button>
              </div>

              <div className="inventory-grid">
                {inventoryLoading ? (
                  <div className="inventory-loading">
                    <div className="empty-icon">
                      📦
                    </div>

                    <h3>
                      Loading inventory...
                    </h3>

                    <p>
                      Please wait while
                      we fetch your
                      inventory.
                    </p>
                  </div>
                ) : inventory.length ===
                  0 ? (
                  <div className="inventory-loading">
                    <div className="empty-icon">
                      📦
                    </div>

                    <h3>
                      No inventory items
                    </h3>

                    <p>
                      No inventory
                      records were found.
                    </p>

                    <button
                      className="primary-btn"
                      onClick={
                        loadInventory
                      }
                    >
                      Refresh Inventory
                    </button>
                  </div>
                ) : (
                  inventory.map(
                    (item) => {
                      const stock =
                        Number(
                          item.stock || 0
                        );

                      const threshold =
                        Number(
                          item.lowStockThreshold ??
                            20
                        );

                      const isLowStock =
                        stock <=
                        threshold;

                      const status =
                        stock > 0
                          ? "Available"
                          : "Out of Stock";

                      return (
                        <div
                          key={
                            item._id
                          }
                          className={`inventory-card ${
                            isLowStock
                              ? "low-stock-card"
                              : ""
                          }`}
                        >
                          <div className="inventory-card-top">
                            <div>
                              <strong>
                                {
                                  item.name
                                }
                              </strong>

                              {item.category && (
                                <small>
                                  {
                                    item.category
                                  }
                                </small>
                              )}
                            </div>

                            <span
                              className={
                                stock >
                                0
                                  ? "inventory-status available"
                                  : "inventory-status out"
                              }
                            >
                              ●{" "}
                              {status}
                            </span>
                          </div>

                          <div className="inventory-stock-info">
                            <span>
                              Current Stock
                            </span>

                            <strong>
                              {stock}
                            </strong>
                          </div>

                          {isLowStock && (
                            <div className="inventory-warning">
                              ⚠️ Low Stock

                              <span>
                                Threshold:{" "}
                                {
                                  threshold
                                }
                              </span>
                            </div>
                          )}

                          <div className="inventory-edit-group">
                            <label
                              htmlFor={`stock-${item._id}`}
                            >
                              Update Stock
                            </label>

                            <div className="inventory-edit-row">
                              <input
                                id={`stock-${item._id}`}
                                type="number"
                                min="0"
                                defaultValue={
                                  stock
                                }
                              />

                              <button
                                className="primary-btn inventory-update-btn"
                                onClick={() => {
                                  const input =
                                    document.getElementById(
                                      `stock-${item._id}`
                                    );

                                  updateInventoryStock(
                                    item._id,
                                    input?.value
                                  );
                                }}
                              >
                                Update
                              </button>
                            </div>
                          </div>

                          <div className="inventory-threshold-info">
                            <span>
                              Low-stock threshold
                            </span>

                            <strong>
                              {
                                threshold
                              }
                            </strong>
                          </div>

                          <div className="inventory-edit-group">
                            <label
                              htmlFor={`threshold-${item._id}`}
                            >
                              Update Threshold
                            </label>

                            <div className="inventory-edit-row">
                              <input
                                id={`threshold-${item._id}`}
                                type="number"
                                min="0"
                                defaultValue={
                                  threshold
                                }
                              />

                              <button
                                className="secondary-btn inventory-update-btn"
                                onClick={() => {
                                  const input =
                                    document.getElementById(
                                      `threshold-${item._id}`
                                    );

                                  updateInventoryThreshold(
                                    item._id,
                                    input?.value
                                  );
                                }}
                              >
                                Update
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )
                )}
              </div>
            </div>
          </div>
        )}

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="footer">
        <div className="footer-content">
          <div>
            <div className="logo footer-logo">
              <span>P</span>
              Pizza
              <span>Craft</span>
            </div>

            <p>
              Fresh pizzas, bold flavours
              and your own creativity —
              all in one delicious
              experience.
            </p>
          </div>

          <div>
            <h4>
              Quick Links
            </h4>

            <div className="footer-links">
              <a
                href="#home"
                onClick={(event) => {
                  event.preventDefault();

                  scrollToSection(
                    "home"
                  );
                }}
              >
                Home
              </a>

              <a
                href="#menu"
                onClick={(event) => {
                  event.preventDefault();

                  scrollToMenu();
                }}
              >
                Menu
              </a>

              <button
                onClick={
                  openBuilder
                }
              >
                Custom Pizza
              </button>

              <a
                href="#about"
                onClick={(event) => {
                  event.preventDefault();

                  scrollToSection(
                    "about"
                  );
                }}
              >
                About
              </a>
            </div>
          </div>

          <div>
            <h4>
              PizzaCraft
            </h4>

            <p>
              Crafted with passion.
              Served with happiness.
              🍕
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          ©{" "}
          {new Date().getFullYear()}{" "}
          PizzaCraft. All rights
          reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;