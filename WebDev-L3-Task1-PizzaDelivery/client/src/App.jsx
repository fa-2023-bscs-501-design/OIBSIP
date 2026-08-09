
import { useState } from "react";
import "./App.css";

function App() {
  const [activeCategory, setActiveCategory] = useState("All");

  const [builderOpen, setBuilderOpen] = useState(false);

  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const [loginOpen, setLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [loginEmail, setLoginEmail] = useState("");

  const [size, setSize] = useState("Medium");
  const [crust, setCrust] = useState("Classic");
  const [sauce, setSauce] = useState("Tomato");
  const [cheese, setCheese] = useState("Mozzarella");
  const [toppings, setToppings] = useState([]);

  const pizzas = [
    {
      name: "Margherita",
      description: "Fresh tomato, mozzarella & basil",
      price: 899,
      category: "Classic",
      emoji: "🍅",
    },
    {
      name: "Pepperoni",
      description: "Loaded pepperoni with melted mozzarella",
      price: 1199,
      category: "Popular",
      emoji: "🍕",
    },
    {
      name: "Garden Fresh",
      description: "Bell peppers, olives, onions & mushrooms",
      price: 1099,
      category: "Veggie",
      emoji: "🥦",
    },
    {
      name: "BBQ Chicken",
      description: "Grilled chicken, BBQ sauce & mozzarella",
      price: 1299,
      category: "Popular",
      emoji: "🍗",
    },
    {
      name: "Four Cheese",
      description: "Mozzarella, cheddar, parmesan & gouda",
      price: 1249,
      category: "Classic",
      emoji: "🧀",
    },
    {
      name: "Spicy Veggie",
      description: "Jalapeños, peppers, onions & spicy sauce",
      price: 1149,
      category: "Veggie",
      emoji: "🌶️",
    },
  ];

  const categories = ["All", "Popular", "Classic", "Veggie"];

  const toppingOptions = [
    { name: "Pepperoni", price: 150, emoji: "🍕" },
    { name: "Mushrooms", price: 100, emoji: "🍄" },
    { name: "Olives", price: 100, emoji: "🫒" },
    { name: "Jalapeños", price: 120, emoji: "🌶️" },
    { name: "Onions", price: 80, emoji: "🧅" },
    { name: "Bell Peppers", price: 100, emoji: "🫑" },
  ];

  const sizePrices = {
    Small: 0,
    Medium: 200,
    Large: 400,
  };

  const crustPrices = {
    Classic: 0,
    "Thin Crust": 100,
    "Cheese Burst": 250,
  };

  const saucePrices = {
    Tomato: 0,
    BBQ: 80,
    "Spicy Garlic": 100,
  };

  const cheesePrices = {
    Mozzarella: 0,
    Cheddar: 100,
    "Four Cheese": 200,
  };

  const filteredPizzas =
    activeCategory === "All"
      ? pizzas
      : pizzas.filter(
          (pizza) => pizza.category === activeCategory
        );

  const toppingsPrice = toppings.reduce((total, toppingName) => {
    const topping = toppingOptions.find(
      (item) => item.name === toppingName
    );

    return total + (topping ? topping.price : 0);
  }, 0);

  const totalPrice =
    899 +
    sizePrices[size] +
    crustPrices[crust] +
    saucePrices[sauce] +
    cheesePrices[cheese] +
    toppingsPrice;

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const toggleTopping = (toppingName) => {
    setToppings((current) =>
      current.includes(toppingName)
        ? current.filter((item) => item !== toppingName)
        : [...current, toppingName]
    );
  };

  const scrollToMenu = () => {
    document.getElementById("menu")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const openBuilder = () => {
    setBuilderOpen(true);

    setTimeout(() => {
      document.getElementById("builder")?.scrollIntoView({
        behavior: "smooth",
      });
    }, 50);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (!userName.trim() || !loginEmail.trim()) {
      return;
    }

    setIsLoggedIn(true);
    setLoginOpen(false);
  };

  const requireLogin = () => {
    if (!isLoggedIn) {
      setLoginOpen(true);
      return false;
    }

    return true;
  };

  const addPizzaToCart = (pizza) => {
    if (!requireLogin()) return;

    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item.name === pizza.name
      );

      if (existingItem) {
        return currentCart.map((item) =>
          item.name === pizza.name
            ? {
                ...item,
                quantity: item.quantity + 1,
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
    });

    setCartOpen(true);
  };

  const openCart = () => {
    if (!requireLogin()) return;

    setCartOpen(true);
  };

  const addToOrder = () => {
    if (!requireLogin()) return;

    const customPizza = {
      name: `${size} ${crust} Pizza`,
      description: `${sauce} sauce • ${cheese} • ${
        toppings.length
          ? toppings.join(", ")
          : "No extra toppings"
      }`,
      price: totalPrice,
      emoji: "🍕",
      quantity: 1,
    };

    setCart((currentCart) => [
      ...currentCart,
      customPizza,
    ]);

    setCartOpen(true);
  };

  const increaseQuantity = (index) => {
    setCart((currentCart) =>
      currentCart.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  const decreaseQuantity = (index) => {
    setCart((currentCart) =>
      currentCart
        .map((item, itemIndex) =>
          itemIndex === index
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (index) => {
    setCart((currentCart) =>
      currentCart.filter(
        (_, itemIndex) => itemIndex !== index
      )
    );
  };

  const handleCheckout = () => {
    if (!isLoggedIn) {
      setLoginOpen(true);
      return;
    }

    if (cart.length === 0) return;

    alert(
      `Thank you, ${userName}! 🍕\n\nYour order total is Rs. ${cartTotal}.\n\nYour PizzaCraft order has been placed successfully!`
    );

    setCart([]);
    setCartOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName("");
    setLoginEmail("");
    setCart([]);
    setCartOpen(false);
  };

  return (
    <div className="app">
      {/* NAVBAR */}

      <header className="navbar">
        <div className="logo">
          <span className="logo-mark">P</span>
          <span>
            Pizza<span>Craft</span>
          </span>
        </div>

        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#menu">Menu</a>
          <a href="#builder">Custom Pizza</a>
          <a href="#about">About</a>
        </nav>

        <div className="nav-actions">
          <button
            className="nav-btn login-btn"
            onClick={() =>
              isLoggedIn
                ? handleLogout()
                : setLoginOpen(true)
            }
          >
            {isLoggedIn
              ? `Logout (${userName})`
              : "Login"}
          </button>

          <button
            className="nav-btn cart-btn"
            onClick={openCart}
          >
            🛒
            <span className="cart-count">
              {cartCount}
            </span>
          </button>
        </div>
      </header>

      <main>
        {/* HERO */}

        <section className="hero-section" id="home">
          <div className="hero-content">
            <p className="hero-badge">
              FRESH • HOT • MADE FOR YOU
            </p>

            <h1>
              Your perfect pizza,
              <span> crafted your way.</span>
            </h1>

            <p>
              Choose from our signature pizzas or build
              your own masterpiece with fresh ingredients
              and bold flavours.
            </p>

            <div className="hero-buttons">
              <button
                className="primary-btn"
                onClick={scrollToMenu}
              >
                Explore Menu →
              </button>

              <button
                className="secondary-btn"
                onClick={openBuilder}
              >
                Build Your Pizza
              </button>
            </div>
          </div>

          <div className="hero-pizza">
            <div className="pizza-visual"></div>
          </div>
        </section>

        {/* CATEGORIES */}

        <section className="categories-section">
          <div className="section-heading">
            <h2>Explore Our Menu</h2>
            <p>
              Pick your favourite pizza and make it yours.
            </p>
          </div>

          <div className="category-list">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-btn ${
                  activeCategory === category
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setActiveCategory(category)
                }
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* MENU */}

        <section className="pizza-section" id="menu">
          <div className="pizza-grid">
            {filteredPizzas.map((pizza) => (
              <article
                className="pizza-card"
                key={pizza.name}
              >
                <div className="pizza-image">
                  <span>{pizza.emoji}</span>
                </div>

                <div className="pizza-info">
                  <h3>{pizza.name}</h3>

                  <p>{pizza.description}</p>

                  <div className="pizza-bottom">
                    <span className="price">
                      Rs. {pizza.price}
                    </span>

                    <button
                      className="add-btn"
                      onClick={() =>
                        addPizzaToCart(pizza)
                      }
                    >
                      Add to Cart +
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* BUILDER */}

        <section
          className="builder-preview"
          id="builder"
          style={{
            padding: "70px 7%",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "40px",
            alignItems: "center",
          }}
        >
          <div>
            <p className="hero-badge">YOUR WAY</p>

            <h2
              style={{
                fontSize: "42px",
                margin: "0 0 18px",
              }}
            >
              Build a pizza{" "}
              <span style={{ color: "var(--accent)" }}>
                that's uniquely yours.
              </span>
            </h2>

            <p
              style={{
                color: "var(--muted)",
                lineHeight: "1.7",
              }}
            >
              Pick your base, sauce, cheese and favourite
              toppings. Create something that tastes
              exactly the way you want.
            </p>

            {!builderOpen && (
              <button
                className="primary-btn"
                onClick={openBuilder}
              >
                Start Building →
              </button>
            )}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(2, 1fr)",
              gap: "15px",
            }}
          >
            {[
              ["01", "Choose Base", "3 size options"],
              ["02", "Pick Sauce", "3 signature sauces"],
              ["03", "Select Cheese", "Premium choices"],
              ["04", "Add Toppings", "Mix your favourites"],
            ].map(([number, title, text]) => (
              <div
                key={number}
                style={{
                  background: "white",
                  border: "1px solid var(--border)",
                  borderRadius: "15px",
                  padding: "20px",
                  boxShadow: "var(--shadow)",
                }}
              >
                <span
                  style={{
                    color: "var(--accent)",
                    fontWeight: "800",
                  }}
                >
                  {number}
                </span>

                <h3>{title}</h3>

                <small
                  style={{
                    color: "var(--muted)",
                  }}
                >
                  {text}
                </small>
              </div>
            ))}
          </div>
        </section>

        {/* PIZZA BUILDER */}

        {builderOpen && (
          <section
            className="pizza-builder"
            style={{
              padding: "30px 7% 80px",
            }}
          >
            <div className="section-heading">
              <h2>
                Create your{" "}
                <span
                  style={{
                    color: "var(--accent)",
                  }}
                >
                  perfect pizza.
                </span>
              </h2>

              <p>
                Choose your ingredients and watch your
                price update.
              </p>
            </div>

            {/* SIZE */}

            <div className="builder-group">
              <h3>1. Choose your size</h3>

              <div className="builder-options">
                {Object.keys(sizePrices).map(
                  (item) => (
                    <button
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
                      <strong>{item}</strong>

                      <span>
                        {sizePrices[item] === 0
                          ? "Included"
                          : `+ Rs. ${sizePrices[item]}`}
                      </span>
                    </button>
                  )
                )}
              </div>
            </div>

            {/* CRUST */}

            <div className="builder-group">
              <h3>2. Choose your crust</h3>

              <div className="builder-options">
                {Object.keys(crustPrices).map(
                  (item) => (
                    <button
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
                      <strong>{item}</strong>

                      <span>
                        {crustPrices[item] === 0
                          ? "Included"
                          : `+ Rs. ${crustPrices[item]}`}
                      </span>
                    </button>
                  )
                )}
              </div>
            </div>

            {/* SAUCE */}

            <div className="builder-group">
              <h3>3. Choose your sauce</h3>

              <div className="builder-options">
                {Object.keys(saucePrices).map(
                  (item) => (
                    <button
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
                      <strong>{item}</strong>

                      <span>
                        {saucePrices[item] === 0
                          ? "Included"
                          : `+ Rs. ${saucePrices[item]}`}
                      </span>
                    </button>
                  )
                )}
              </div>
            </div>

            {/* CHEESE */}

            <div className="builder-group">
              <h3>4. Choose your cheese</h3>

              <div className="builder-options">
                {Object.keys(cheesePrices).map(
                  (item) => (
                    <button
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
                      <strong>{item}</strong>

                      <span>
                        {cheesePrices[item] === 0
                          ? "Included"
                          : `+ Rs. ${cheesePrices[item]}`}
                      </span>
                    </button>
                  )
                )}
              </div>
            </div>

            {/* TOPPINGS */}

            <div className="builder-group">
              <h3>5. Add your toppings</h3>

              <div className="builder-options">
                {toppingOptions.map(
                  (topping) => {
                    const selected =
                      toppings.includes(
                        topping.name
                      );

                    return (
                      <button
                        key={topping.name}
                        className={`builder-option ${
                          selected
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
                          {topping.emoji}
                        </span>

                        <strong>
                          {topping.name}
                        </strong>

                        <span>
                          + Rs. {topping.price}
                        </span>
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* SUMMARY */}

            <div
              className="builder-summary"
              style={{
                marginTop: "30px",
                padding: "25px",
                background: "white",
                border: "1px solid var(--border)",
                borderRadius: "18px",
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                gap: "20px",
                flexWrap: "wrap",
                boxShadow: "var(--shadow)",
              }}
            >
              <div>
                <p className="hero-badge">
                  YOUR CREATION
                </p>

                <h3>
                  🍕 {size} {crust} Pizza
                </h3>

                <p
                  style={{
                    color: "var(--muted)",
                  }}
                >
                  {sauce} sauce • {cheese} •{" "}
                  {toppings.length
                    ? toppings.join(", ")
                    : "No extra toppings"}
                </p>
              </div>

              <div>
                <span
                  style={{
                    display: "block",
                    color: "var(--muted)",
                  }}
                >
                  Total
                </span>

                <strong
                  style={{
                    display: "block",
                    color: "var(--accent)",
                    fontSize: "28px",
                    marginBottom: "12px",
                  }}
                >
                  Rs. {totalPrice}
                </strong>

                <button
                  className="primary-btn"
                  onClick={addToOrder}
                >
                  Add to Order 🛒
                </button>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* LOGIN MODAL */}

      {loginOpen && (
        <div
          className="login-overlay"
          onClick={() =>
            setLoginOpen(false)
          }
        >
          <div
            className="login-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div className="modal-header">
              <h2>Login to Order 🍕</h2>

              <button
                className="close-btn"
                onClick={() =>
                  setLoginOpen(false)
                }
              >
                ×
              </button>
            </div>

            <p
              style={{
                color: "var(--muted)",
              }}
            >
              Enter your details to continue
              ordering.
            </p>

            <form onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="Your name"
                value={userName}
                onChange={(e) =>
                  setUserName(e.target.value)
                }
                required
              />

              <input
                type="email"
                placeholder="Email address"
                value={loginEmail}
                onChange={(e) =>
                  setLoginEmail(e.target.value)
                }
                required
              />

              <button
                type="submit"
                className="primary-btn"
                style={{
                  width: "100%",
                }}
              >
                Continue to Order →
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CART */}

      {cartOpen && (
        <div
          className="cart-overlay"
          onClick={() =>
            setCartOpen(false)
          }
        >
          <aside
            className="cart-panel"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div className="modal-header">
              <h2>Your Cart 🛒</h2>

              <button
                className="close-btn"
                onClick={() =>
                  setCartOpen(false)
                }
              >
                ×
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="cart-empty">
                <div
                  style={{
                    fontSize: "60px",
                  }}
                >
                  🍕
                </div>

                <h3>Your cart is empty</h3>

                <p>
                  Add something delicious from
                  our menu.
                </p>

                <button
                  className="primary-btn"
                  onClick={() => {
                    setCartOpen(false);
                    scrollToMenu();
                  }}
                >
                  Explore Menu →
                </button>
              </div>
            ) : (
              <>
                {cart.map((item, index) => (
                  <div
                    className="cart-item"
                    key={`${item.name}-${index}`}
                  >
                    <div className="cart-item-image">
                      {item.emoji}
                    </div>

                    <div className="cart-item-info">
                      <h4>{item.name}</h4>

                      <p>
                        Rs. {item.price}
                      </p>

                      <div
                        style={{
                          display: "flex",
                          alignItems:
                            "center",
                          gap: "10px",
                          marginTop:
                            "10px",
                        }}
                      >
                        <button
                          className="close-btn"
                          onClick={() =>
                            decreaseQuantity(
                              index
                            )
                          }
                        >
                          −
                        </button>

                        <strong>
                          {item.quantity}
                        </strong>

                        <button
                          className="close-btn"
                          onClick={() =>
                            increaseQuantity(
                              index
                            )
                          }
                        >
                          +
                        </button>

                        <button
                          style={{
                            marginLeft:
                              "auto",
                            border: "none",
                            background:
                              "transparent",
                            color:
                              "var(--accent)",
                            fontWeight:
                              "700",
                          }}
                          onClick={() =>
                            removeFromCart(
                              index
                            )
                          }
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <div
                  style={{
                    borderTop:
                      "1px solid var(--border)",
                    marginTop: "20px",
                    paddingTop: "20px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      marginBottom: "18px",
                    }}
                  >
                    <strong>Total</strong>

                    <strong
                      style={{
                        color:
                          "var(--accent)",
                        fontSize:
                          "22px",
                      }}
                    >
                      Rs. {cartTotal}
                    </strong>
                  </div>

                  <button
                    className="primary-btn"
                    style={{
                      width: "100%",
                    }}
                    onClick={handleCheckout}
                  >
                    Place Order →
                  </button>
                </div>
              </>
            )}
          </aside>
        </div>
      )}

      {/* FOOTER */}

      <footer className="footer" id="about">
        <div className="footer-content">
          <div>
            <div className="logo">
              Pizza<span>Craft</span>
            </div>

            <p>
              Fresh pizza. Your way. Every time.
            </p>
          </div>

          <div>
            <h4>Quick Links</h4>

            <div className="footer-links">
              <a href="#home">Home</a>
              <a href="#menu">Menu</a>
              <a href="#builder">
                Custom Pizza
              </a>
            </div>
          </div>

          <div>
            <h4>PizzaCraft</h4>

            <p>
              Handcrafted pizzas made with fresh
              ingredients and bold flavours.
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          © 2026 PizzaCraft. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;
