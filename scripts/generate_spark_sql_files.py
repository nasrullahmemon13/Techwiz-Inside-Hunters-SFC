"""
Populates production Spark SQL files into spark_sql/ and pyspark/queries/
"""
import os

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
SPARK_SQL_DIR = os.path.join(PROJECT_ROOT, "spark_sql")
PYSPARK_QUERIES_DIR = os.path.join(PROJECT_ROOT, "pyspark", "queries")

os.makedirs(SPARK_SQL_DIR, exist_ok=True)
os.makedirs(PYSPARK_QUERIES_DIR, exist_ok=True)

queries = {
    "01_sales_and_revenue_trends.sql": """-- Query 1: Daily and Monthly Sales Trends
-- Computes aggregated transactional revenue, order volume, and average order value.
SELECT 
    order_date,
    COUNT(DISTINCT order_id) AS total_orders,
    ROUND(SUM(total_amount), 2) AS gross_revenue,
    ROUND(AVG(total_amount), 2) AS average_order_value,
    ROUND(SUM(discount_amount), 2) AS total_discounts_given
FROM orders
GROUP BY order_date
ORDER BY order_date ASC;
""",
    "02_category_profitability_margins.sql": """-- Query 2: Menu Category Profitability & Contribution Margin
-- Evaluates gross margin percentage and financial contribution per food category.
SELECT 
    c.category_name,
    COUNT(oi.order_item_id) AS total_items_sold,
    ROUND(SUM(oi.item_total), 2) AS total_revenue,
    ROUND(SUM(oi.quantity * m.cost_price), 2) AS total_ingredient_cost,
    ROUND(SUM(oi.item_total) - SUM(oi.quantity * m.cost_price), 2) AS contribution_margin,
    ROUND(((SUM(oi.item_total) - SUM(oi.quantity * m.cost_price)) / SUM(oi.item_total)) * 100, 2) AS margin_percentage
FROM order_items oi
JOIN menu_items m ON oi.item_id = m.item_id
JOIN menu_categories c ON m.category_id = c.category_id
GROUP BY c.category_name
ORDER BY contribution_margin DESC;
""",
    "03_menu_item_performance.sql": """-- Query 3: Item-Level Unit Volume and Popularity Ranking
-- Ranks individual dishes by total quantity sold and revenue generated.
SELECT 
    m.item_id,
    m.name AS item_name,
    c.category_name,
    m.base_price,
    m.cost_price,
    SUM(oi.quantity) AS total_quantity_sold,
    ROUND(SUM(oi.item_total), 2) AS total_item_revenue,
    COUNT(DISTINCT oi.order_id) AS distinct_orders_containing_item
FROM order_items oi
JOIN menu_items m ON oi.item_id = m.item_id
JOIN menu_categories c ON m.category_id = c.category_id
GROUP BY m.item_id, m.name, c.category_name, m.base_price, m.cost_price
ORDER BY total_quantity_sold DESC;
""",
    "04_customer_spend_quartiles.sql": """-- Query 4: Customer Spending Quartiles & Loyalty Stratification
-- Computes customer monetary distribution across completed orders.
SELECT 
    c.customer_id,
    c.customer_segment,
    c.loyalty_tier,
    COUNT(DISTINCT o.order_id) AS completed_orders_count,
    ROUND(SUM(o.total_amount), 2) AS lifetime_monetary_spend,
    ROUND(AVG(o.total_amount), 2) AS average_ticket_size,
    MAX(o.order_date) AS most_recent_order_date
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
WHERE o.order_status = 'Completed'
GROUP BY c.customer_id, c.customer_segment, c.loyalty_tier
ORDER BY lifetime_monetary_spend DESC;
""",
    "05_location_benchmarks.sql": """-- Query 5: Restaurant Location Performance Benchmarking
-- Evaluates multi-unit metrics: revenue, average check, and volume per location.
SELECT 
    r.location_id,
    r.name AS restaurant_name,
    r.city,
    COUNT(DISTINCT o.order_id) AS total_orders_fulfilled,
    ROUND(SUM(o.total_amount), 2) AS total_location_revenue,
    ROUND(AVG(o.total_amount), 2) AS average_order_ticket
FROM orders o
JOIN restaurants r ON o.location_id = r.location_id
GROUP BY r.location_id, r.name, r.city
ORDER BY total_location_revenue DESC;
""",
    "06_kitchen_wastage_by_cause.sql": """-- Query 6: Kitchen Spoilage & Food Wastage Financial Loss
-- Quantifies inventory loss amount and units wasted categorized by reason.
SELECT 
    wastage_reason,
    COUNT(wastage_id) AS waste_incident_count,
    ROUND(SUM(quantity_wasted), 2) AS total_quantity_wasted_kg,
    ROUND(SUM(total_loss_amount), 2) AS total_financial_loss_dollars
FROM wastage
GROUP BY wastage_reason
ORDER BY total_financial_loss_dollars DESC;
""",
    "07_promotion_effectiveness_lift.sql": """-- Query 7: Promotional Campaign Lift & Net Discount Absorption
-- Audits revenue, order count, and total discount value for promotional campaigns.
SELECT 
    p.promotion_id,
    p.promotion_name,
    p.discount_type,
    p.discount_value,
    COUNT(DISTINCT o.order_id) AS promo_orders_count,
    ROUND(SUM(o.total_amount), 2) AS promo_generated_revenue,
    ROUND(SUM(o.discount_amount), 2) AS promo_discounts_absorbed
FROM orders o
JOIN promotions p ON o.promotion_id = p.promotion_id
GROUP BY p.promotion_id, p.promotion_name, p.discount_type, p.discount_value
ORDER BY promo_generated_revenue DESC;
""",
    "08_channel_margin_economics.sql": """-- Query 8: Ordering Channel Economics (Dine-in vs Takeaway vs Delivery)
-- Analyzes fulfillment channel revenue, average ticket size, and volume.
SELECT 
    order_type AS fulfillment_channel,
    COUNT(DISTINCT order_id) AS total_transactions,
    ROUND(SUM(total_amount), 2) AS channel_gross_revenue,
    ROUND(AVG(total_amount), 2) AS average_ticket_size,
    ROUND(SUM(delivery_fee), 2) AS total_delivery_fees_collected
FROM orders
GROUP BY order_type
ORDER BY channel_gross_revenue DESC;
"""
}

for fname, sql in queries.items():
    p1 = os.path.join(SPARK_SQL_DIR, fname)
    p2 = os.path.join(PYSPARK_QUERIES_DIR, fname)
    with open(p1, "w", encoding="utf-8") as f:
        f.write(sql)
    with open(p2, "w", encoding="utf-8") as f:
        f.write(sql)
    print(f"Written: {fname}")

print(f"Successfully generated {len(queries)} Spark SQL queries into spark_sql/ and pyspark/queries/")
