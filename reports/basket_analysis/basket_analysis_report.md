# DineIQ Analytics - Steps 17 & 18: Market Basket Analysis & Association Rules

**Execution Timestamp:** 2026-09-24 15:28:42
**Total Transactions Evaluated:** 90,464 orders (904,502 line-items)
**Total Statistically Verified Association Rules:** 946 rules

## 1. Top Association Rules by Lift (Step 17)

| Rank | Antecedent (If Ordered) | Consequent (Also Ordered) | Support (%) | Confidence (%) | Lift | Joint Orders |
|---:|---|---|---:|---:|---:|---:|
| 1 | `Yuzu Lavender Gin Tonic` | `Hibiscus Berry Botanical Fizz (Mocktail)` | 0.58% | 8.1% | **1.129** | 527 |
| 2 | `Hibiscus Berry Botanical Fizz (Mocktail)` | `Yuzu Lavender Gin Tonic` | 0.58% | 8.1% | **1.129** | 527 |
| 3 | `Creamy Cashew Alfredo Tagliatelle` | `Classic Madagascar Vanilla Bean Gelato` | 0.63% | 11.8% | **1.125** | 566 |
| 4 | `Chipotle Fish Tacos (3pcs)` | `Molten Chocolate Lava Cake` | 0.72% | 13.6% | **1.120** | 647 |
| 5 | `Truffle Wild Mushroom Risotto` | `Quattro Formaggi Bianca` | 0.52% | 9.2% | **1.109** | 468 |
| 6 | `Cold Pressed Green Detox Juice` | `New York Style Cheesecake` | 0.51% | 12.0% | **1.106** | 458 |
| 7 | `Sparkling San Pellegrino (750ml)` | `Smoked Rosemary Paloma Tequila` | 0.59% | 8.4% | **1.106** | 531 |
| 8 | `Roasted Beet & Goat Cheese Bowl` | `Spicy Nashville Hot Chicken Bun` | 0.54% | 10.3% | **1.104** | 488 |
| 9 | `BBQ Glazed St. Louis Ribs (Full)` | `Affogato al Caffe Espresso Scoop` | 0.61% | 9.5% | **1.104** | 555 |
| 10 | `Spicy Tuna Crispy Rice` | `Classic BLT Sourdough` | 0.53% | 9.0% | **1.103** | 478 |
| 11 | `Portobello Mushroom Swiss Burger` | `DineIQ Signature Caesar Salad` | 0.59% | 13.0% | **1.102** | 535 |
| 12 | `Thai Crunch Peanut Chicken Salad` | `Crispy Cauliflower Buffalo Bites` | 0.59% | 8.3% | **1.100** | 534 |
| 13 | `Slow-Braised Beef Short Ribs` | `Crispy Parmesan Truffle Fries` | 0.85% | 14.1% | **1.100** | 772 |
| 14 | `Wild Rice & Avocado Harvest Bowl` | `Southwest Chipotle Chicken Bowl` | 0.53% | 9.3% | **1.099** | 480 |
| 15 | `Acai Berry Superfood Smoothie` | `Aperol Spritz Prosecco Orange` | 0.69% | 11.2% | **1.098** | 627 |

## 2. Actionable Commercial Recommendations (Step 18)

All recommendations are directly backed by empirical association-rule evidence:

### Combo Meal Recommendations (12 Opportunities)

| Primary Item | Recommended Item | Pair Categories | Lift | Confidence | Commercial Strategy |
|---|---|---|---:|---:|---|
| **Chipotle Fish Tacos (3pcs)** | **Molten Chocolate Lava Cake** | `Artisanal Burgers & Handhelds + Handcrafted Desserts & Pastries` | 1.120 | 13.6% | Bundle into 'Chipotle Fish Tacos (3pcs) & Molten Chocolate Lava Cake Duo'. Reg: $27.49 -> Combo: $24.19 (Save $3.30). |
| **Cold Pressed Green Detox Juice** | **New York Style Cheesecake** | `Specialty Coffee & Beverages + Handcrafted Desserts & Pastries` | 1.106 | 12.0% | Bundle into 'Cold Pressed Green Detox Juice & New York Style Cheesecake Duo'. Reg: $18.49 -> Combo: $16.27 (Save $2.22). |
| **Portobello Mushroom Swiss Burger** | **DineIQ Signature Caesar Salad** | `Artisanal Burgers & Handhelds + Farm-Fresh Salads & Grain Bowls` | 1.102 | 13.0% | Bundle into 'Portobello Mushroom Swiss Burger & DineIQ Signature Caesar Salad Duo'. Reg: $27.99 -> Combo: $24.63 (Save $3.36). |
| **Slow-Braised Beef Short Ribs** | **Crispy Parmesan Truffle Fries** | `Prime Steaks & Butcher Cuts + Appetizers & Small Plates` | 1.100 | 14.1% | Bundle into 'Slow-Braised Beef Short Ribs & Crispy Parmesan Truffle Fries Duo'. Reg: $44.99 -> Combo: $39.59 (Save $5.40). |
| **Kale Tahini Caesar Roasted Chickpeas** | **Garlic Herb Breadsticks** | `Farm-Fresh Salads & Grain Bowls + Appetizers & Small Plates` | 1.097 | 12.2% | Bundle into 'Kale Tahini Caesar Roasted Chickpeas & Garlic Herb Breadsticks Duo'. Reg: $20.98 -> Combo: $18.46 (Save $2.52). |
| **Seafood Paella Valenciana** | **Classic Buffalo Chicken Wings** | `Chef Specials & Seafood + Appetizers & Small Plates` | 1.096 | 13.2% | Bundle into 'Seafood Paella Valenciana & Classic Buffalo Chicken Wings Duo'. Reg: $49.50 -> Combo: $43.56 (Save $5.94). |

### Cross-Sell Opportunity Recommendations (12 Opportunities)

| Primary Item | Recommended Item | Pair Categories | Lift | Confidence | Commercial Strategy |
|---|---|---|---:|---:|---|
| **Chipotle Fish Tacos (3pcs)** | **Molten Chocolate Lava Cake** | `Artisanal Burgers & Handhelds -> Handcrafted Desserts & Pastries` | 1.120 | 13.6% | Prompt: 'Add Molten Chocolate Lava Cake for the perfect pairing!' (Confidence: 13.6%). |
| **Cold Pressed Green Detox Juice** | **New York Style Cheesecake** | `Specialty Coffee & Beverages -> Handcrafted Desserts & Pastries` | 1.106 | 12.0% | Prompt: 'Add New York Style Cheesecake for the perfect pairing!' (Confidence: 12.0%). |
| **Portobello Mushroom Swiss Burger** | **DineIQ Signature Caesar Salad** | `Artisanal Burgers & Handhelds -> Farm-Fresh Salads & Grain Bowls` | 1.102 | 13.0% | Prompt: 'Add DineIQ Signature Caesar Salad for the perfect pairing!' (Confidence: 13.0%). |
| **Slow-Braised Beef Short Ribs** | **Crispy Parmesan Truffle Fries** | `Prime Steaks & Butcher Cuts -> Appetizers & Small Plates` | 1.100 | 14.1% | Prompt: 'Add Crispy Parmesan Truffle Fries for the perfect pairing!' (Confidence: 14.1%). |
| **Kale Tahini Caesar Roasted Chickpeas** | **Garlic Herb Breadsticks** | `Farm-Fresh Salads & Grain Bowls -> Appetizers & Small Plates` | 1.097 | 12.2% | Prompt: 'Add Garlic Herb Breadsticks for the perfect pairing!' (Confidence: 12.2%). |
| **Seafood Paella Valenciana** | **Classic Buffalo Chicken Wings** | `Chef Specials & Seafood -> Appetizers & Small Plates` | 1.096 | 13.2% | Prompt: 'Add Classic Buffalo Chicken Wings for the perfect pairing!' (Confidence: 13.2%). |

### Upsell Combination Recommendations (7 Opportunities)

| Primary Item | Recommended Item | Pair Categories | Lift | Confidence | Commercial Strategy |
|---|---|---|---:|---:|---|
| **Slow-Braised Beef Short Ribs** | **Crispy Parmesan Truffle Fries** | `Prime Steaks & Butcher Cuts -> Appetizers & Small Plates` | 1.100 | 14.1% | Upgrade ticket size by pairing core entree with premium Appetizers & Small Plates (Crispy Parmesan Truffle Fries). |
| **Kale Tahini Caesar Roasted Chickpeas** | **Garlic Herb Breadsticks** | `Farm-Fresh Salads & Grain Bowls -> Appetizers & Small Plates` | 1.097 | 12.2% | Upgrade ticket size by pairing core entree with premium Appetizers & Small Plates (Garlic Herb Breadsticks). |
| **Seafood Paella Valenciana** | **Classic Buffalo Chicken Wings** | `Chef Specials & Seafood -> Appetizers & Small Plates` | 1.096 | 13.2% | Upgrade ticket size by pairing core entree with premium Appetizers & Small Plates (Classic Buffalo Chicken Wings). |
| **Korean Gochujang Crispy Tofu** | **Golden Mozzarella Sticks** | `Vegan & Plant-Based Creations -> Appetizers & Small Plates` | 1.092 | 11.6% | Upgrade ticket size by pairing core entree with premium Appetizers & Small Plates (Golden Mozzarella Sticks). |
| **Thai Crunch Peanut Chicken Salad** | **Crispy Calamari Fritti** | `Farm-Fresh Salads & Grain Bowls -> Appetizers & Small Plates` | 1.088 | 8.4% | Upgrade ticket size by pairing core entree with premium Appetizers & Small Plates (Crispy Calamari Fritti). |
| **Zero-Proof Cucumber Mint Cooler** | **Loaded Queso Nachos** | `Signature Cocktails & Mocktails -> Appetizers & Small Plates` | 1.080 | 9.7% | Upgrade ticket size by pairing core entree with premium Appetizers & Small Plates (Loaded Queso Nachos). |

### Frequently Paired Dishes Recommendations (15 Opportunities)

| Primary Item | Recommended Item | Pair Categories | Lift | Confidence | Commercial Strategy |
|---|---|---|---:|---:|---|
| **Yuzu Lavender Gin Tonic** | **Hibiscus Berry Botanical Fizz (Mocktail)** | `Signature Cocktails & Mocktails + Signature Cocktails & Mocktails` | 1.129 | 8.1% | High behavioral affinity (Lift = 1.13, ordered together in 527 transactions). |
| **Creamy Cashew Alfredo Tagliatelle** | **Classic Madagascar Vanilla Bean Gelato** | `Vegan & Plant-Based Creations + Handcrafted Desserts & Pastries` | 1.125 | 11.8% | High behavioral affinity (Lift = 1.12, ordered together in 566 transactions). |
| **Chipotle Fish Tacos (3pcs)** | **Molten Chocolate Lava Cake** | `Artisanal Burgers & Handhelds + Handcrafted Desserts & Pastries` | 1.120 | 13.6% | High behavioral affinity (Lift = 1.12, ordered together in 647 transactions). |
| **Truffle Wild Mushroom Risotto** | **Quattro Formaggi Bianca** | `Vegan & Plant-Based Creations + Wood-Fired Pizzas & Pastas` | 1.109 | 9.2% | High behavioral affinity (Lift = 1.11, ordered together in 468 transactions). |
| **Cold Pressed Green Detox Juice** | **New York Style Cheesecake** | `Specialty Coffee & Beverages + Handcrafted Desserts & Pastries` | 1.106 | 12.0% | High behavioral affinity (Lift = 1.11, ordered together in 458 transactions). |
| **Sparkling San Pellegrino (750ml)** | **Smoked Rosemary Paloma Tequila** | `Specialty Coffee & Beverages + Signature Cocktails & Mocktails` | 1.106 | 8.4% | High behavioral affinity (Lift = 1.11, ordered together in 531 transactions). |

