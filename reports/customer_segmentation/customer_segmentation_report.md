# DineIQ Analytics - Steps 15 & 16: Customer Segmentation & RFM Analysis Report

**Execution Timestamp:** 2026-09-24 15:24:42
**Total Customers Segmented:** 50,000 profiles

## 1. Step 15: Customer Segmentation Across the EXACT 10 Factors

All 10 factors specified in SRS have been calculated and incorporated into the segmentation logic:
1. `recency` (days since last purchase)
2. `frequency` (lifetime order count)
3. `monetary_value` (lifetime cumulative spend)
4. `average_order_value` (mean spend per order)
5. `visit_frequency` (average cadence in days between visits)
6. `favorite_menu_categories` (dominant menu category preference)
7. `promotion_sensitivity` (ratio of orders using promotion discounts)
8. `ordering_channel` (dominant channel: Dine-in, Takeout, Delivery)
9. `time_of_day_preference` (Lunch, Dinner, Late-Night)
10. `repeat_behavior` (item re-ordering consistency)

## 2. The 6 SRS Suggested Customer Segments

| Customer Segment | Count | Share (%) | Mean Recency (days) | Mean Frequency | Mean Spend ($) | Mean AOV ($) | Strategic Marketing Action |
|---|---:|---:|---:|---:|---:|---:|---|
| **At-Risk Customers** | 5,749 | 11.5% | 207.5 | 2.4 | $641.08 | $269.16 | Win-back automated email/SMS sequence, 20% reactivation discount coupon. |
| **Frequent Customers** | 716 | 1.4% | 49.7 | 3.0 | $540.69 | $179.13 | Subscription passes, digital stamp cards, loyalty milestone bonuses. |
| **High-Value Loyal Customers** | 5,707 | 11.4% | 44.7 | 3.6 | $1,014.86 | $284.24 | VIP concierge, early access to new seasonal dishes, personalized thank-you rewards. |
| **New Customers** | 8,187 | 16.4% | 29.5 | 1.6 | $435.23 | $269.73 | Welcome onboarding flow, second-visit bounce-back voucher. |
| **Occasional Customers** | 23,539 | 47.1% | 254.6 | 0.8 | $208.47 | $167.43 | Holiday and event-triggered promotions, general brand newsletters. |
| **Promotion-Driven Customers** | 6,102 | 12.2% | 71.9 | 3.1 | $827.80 | $264.48 | Flash sales, Tuesday off-peak deals, minimum spend bundle thresholds. |

## 3. Step 16: RFM Analysis Summary

Customers were scored into quintiles (1 to 5) across Recency, Frequency, and Monetary dimensions:

| Metric | Mean Value | 20th Percentile | 50th Percentile (Median) | 80th Percentile |
|---|---:|---:|---:|---:|
| **Recency (days)** | 163.1 | 38.0 | 134.0 | 330.0 |
| **Frequency (orders)** | 1.74 | 1 | 2 | 3 |
| **Monetary Value ($)** | $467.72 | $123.38 | $401.76 | $773.93 |

