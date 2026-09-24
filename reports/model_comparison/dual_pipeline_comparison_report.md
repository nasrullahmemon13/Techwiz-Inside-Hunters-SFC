# DineIQ Analytics - Step 14: Dual Pipeline Comparison Report

**Execution Timestamp:** 2026-09-24 15:16:19  
**Analytical Task:** Menu Performance Classification (SRS Recommended List)  
**Engines Evaluated:** Apache Spark MLlib / Spark SQL vs Independent Python (Pandas/Scikit-learn/XGBoost)  
**Deliverable Requirement:** Record-level comparison across at least 100 records (Total Evaluated: **150 records**)  
**SRS Explicit Guideline:** *"Exact equality is not required for independently trained models."*  

## 1. Executive Reconciliation Summary

- **Overall Agreement Percentage:** **97.33%** (146 / 150 concordant records)
- **Disagreements / Boundary Variances:** **4** (2.67%)
- **Mean Numerical Score Difference:** `0.0996` across normalized composite indices

### Category Cross-Classification Matrix

| Spark result       |   Hidden Opportunity |   Low Performer |   Profit Driver |   Volume Driver |   All |
|:-------------------|---------------------:|----------------:|----------------:|----------------:|------:|
| Hidden Opportunity |                    9 |               0 |               0 |               0 |     9 |
| Low Performer      |                    2 |              69 |               0 |               0 |    71 |
| Profit Driver      |                    0 |               0 |              31 |               0 |    31 |
| Volume Driver      |                    0 |               0 |               2 |              37 |    39 |
| All                |                   11 |              69 |              33 |              37 |   150 |

---

## 2. Record-by-Record Dual Pipeline Comparison Matrix

Table contains EXACTLY the 8 required SRS fields for all 150 menu item records:

| Record ID | Actual class or value | Spark result | Python result | Match or mismatch | Numerical difference | Explanation of disagreement |
|---|---|---|---|:---:|---:|---|
| `ITEM-007` | Volume Driver | Volume Driver | Volume Driver | **MATCH** | 0.1479 | Consensus across both independent engines |
| `ITEM-011` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.0822 | Consensus across both independent engines |
| `ITEM-020` | Volume Driver | Volume Driver | Volume Driver | **MATCH** | 0.1453 | Consensus across both independent engines |
| `ITEM-049` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.1237 | Consensus across both independent engines |
| `ITEM-051` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.0828 | Consensus across both independent engines |
| `ITEM-059` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.1447 | Consensus across both independent engines |
| `ITEM-062` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.0322 | Consensus across both independent engines |
| `ITEM-073` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.0808 | Consensus across both independent engines |
| `ITEM-079` | Profit Driver | Profit Driver | Profit Driver | **MATCH** | 0.0996 | Consensus across both independent engines |
| `ITEM-092` | Hidden Opportunity | Hidden Opportunity | Hidden Opportunity | **MATCH** | 0.1134 | Consensus across both independent engines |
| `ITEM-094` | Hidden Opportunity | Hidden Opportunity | Hidden Opportunity | **MATCH** | 0.0955 | Consensus across both independent engines |
| `ITEM-096` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.0125 | Consensus across both independent engines |
| `ITEM-104` | Profit Driver | Profit Driver | Profit Driver | **MATCH** | 0.0756 | Consensus across both independent engines |
| `ITEM-110` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.1053 | Consensus across both independent engines |
| `ITEM-111` | Profit Driver | Profit Driver | Profit Driver | **MATCH** | 0.0585 | Consensus across both independent engines |
| `ITEM-120` | Volume Driver | Volume Driver | Volume Driver | **MATCH** | 0.0255 | Consensus across both independent engines |
| `ITEM-121` | Volume Driver | Volume Driver | Volume Driver | **MATCH** | 0.1281 | Consensus across both independent engines |
| `ITEM-126` | Profit Driver | Profit Driver | Profit Driver | **MATCH** | 0.2290 | Consensus across both independent engines |
| `ITEM-145` | Volume Driver | Volume Driver | Volume Driver | **MATCH** | 0.0121 | Consensus across both independent engines |
| `ITEM-147` | Volume Driver | Volume Driver | Volume Driver | **MATCH** | 0.0163 | Consensus across both independent engines |
| `ITEM-019` | Volume Driver | Volume Driver | Volume Driver | **MATCH** | 0.1002 | Consensus across both independent engines |
| `ITEM-041` | Profit Driver | Profit Driver | Profit Driver | **MATCH** | 0.1610 | Consensus across both independent engines |
| `ITEM-047` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.0649 | Consensus across both independent engines |
| `ITEM-064` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.0773 | Consensus across both independent engines |
| `ITEM-065` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.0800 | Consensus across both independent engines |
| `ITEM-067` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.1291 | Consensus across both independent engines |
| `ITEM-072` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.0157 | Consensus across both independent engines |
| `ITEM-105` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.1833 | Consensus across both independent engines |
| `ITEM-115` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.0560 | Consensus across both independent engines |
| `ITEM-125` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.0141 | Consensus across both independent engines |
| `ITEM-130` | Profit Driver | Profit Driver | Profit Driver | **MATCH** | 0.2156 | Consensus across both independent engines |
| `ITEM-133` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.0029 | Consensus across both independent engines |
| `ITEM-140` | Profit Driver | Profit Driver | Profit Driver | **MATCH** | 0.0432 | Consensus across both independent engines |
| `ITEM-148` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.1261 | Consensus across both independent engines |
| `ITEM-010` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.0040 | Consensus across both independent engines |
| `ITEM-015` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.0539 | Consensus across both independent engines |
| `ITEM-025` | Volume Driver | Volume Driver | Volume Driver | **MATCH** | 0.1538 | Consensus across both independent engines |
| `ITEM-028` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.0832 | Consensus across both independent engines |
| `ITEM-043` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.0407 | Consensus across both independent engines |
| `ITEM-046` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.2347 | Consensus across both independent engines |
| `ITEM-053` | Profit Driver | Low Performer | Hidden Opportunity | **MISMATCH** | 0.1421 | Quality-satisfaction divergence: High rating (3.70) and repeat loyalty (2.7%) qualified item as Hidden Opportunity in Python. |
| `ITEM-054` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.1955 | Consensus across both independent engines |
| `ITEM-058` | Volume Driver | Volume Driver | Volume Driver | **MATCH** | 0.2036 | Consensus across both independent engines |
| `ITEM-061` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.0309 | Consensus across both independent engines |
| `ITEM-077` | Profit Driver | Profit Driver | Profit Driver | **MATCH** | 0.1575 | Consensus across both independent engines |
| `ITEM-078` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.1070 | Consensus across both independent engines |
| `ITEM-084` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.0517 | Consensus across both independent engines |
| `ITEM-088` | Profit Driver | Profit Driver | Profit Driver | **MATCH** | 0.0727 | Consensus across both independent engines |
| `ITEM-103` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.1226 | Consensus across both independent engines |
| `ITEM-112` | Profit Driver | Profit Driver | Profit Driver | **MATCH** | 0.0451 | Consensus across both independent engines |
| `ITEM-119` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.1419 | Consensus across both independent engines |
| `ITEM-127` | Profit Driver | Volume Driver | Profit Driver | **MISMATCH** | 0.0494 | Boundary condition: Python's RobustScaler combined high repeat purchase (6.4%) with margin ($74,582) to promote item to Profit Driver. |
| `ITEM-128` | Volume Driver | Volume Driver | Volume Driver | **MATCH** | 0.0452 | Consensus across both independent engines |
| `ITEM-132` | Profit Driver | Profit Driver | Profit Driver | **MATCH** | 0.1872 | Consensus across both independent engines |
| `ITEM-136` | Volume Driver | Volume Driver | Volume Driver | **MATCH** | 0.0449 | Consensus across both independent engines |
| `ITEM-137` | Profit Driver | Profit Driver | Profit Driver | **MATCH** | 0.0575 | Consensus across both independent engines |
| `ITEM-143` | Volume Driver | Volume Driver | Volume Driver | **MATCH** | 0.1150 | Consensus across both independent engines |
| `ITEM-009` | Volume Driver | Volume Driver | Volume Driver | **MATCH** | 0.1224 | Consensus across both independent engines |
| `ITEM-012` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.0045 | Consensus across both independent engines |
| `ITEM-016` | Volume Driver | Volume Driver | Volume Driver | **MATCH** | 0.1963 | Consensus across both independent engines |
| `ITEM-017` | Volume Driver | Volume Driver | Volume Driver | **MATCH** | 0.1566 | Consensus across both independent engines |
| `ITEM-024` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.0212 | Consensus across both independent engines |
| `ITEM-026` | Profit Driver | Volume Driver | Profit Driver | **MISMATCH** | 0.1376 | Boundary condition: Python's RobustScaler combined high repeat purchase (7.4%) with margin ($80,341) to promote item to Profit Driver. |
| `ITEM-033` | Volume Driver | Volume Driver | Volume Driver | **MATCH** | 0.1507 | Consensus across both independent engines |
| `ITEM-035` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.0066 | Consensus across both independent engines |
| `ITEM-039` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.0170 | Consensus across both independent engines |
| `ITEM-044` | Profit Driver | Profit Driver | Profit Driver | **MATCH** | 0.1633 | Consensus across both independent engines |
| `ITEM-056` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.0714 | Consensus across both independent engines |
| `ITEM-069` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.0415 | Consensus across both independent engines |
| `ITEM-071` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.0062 | Consensus across both independent engines |
| `ITEM-082` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.0152 | Consensus across both independent engines |
| `ITEM-083` | Profit Driver | Profit Driver | Profit Driver | **MATCH** | 0.0771 | Consensus across both independent engines |
| `ITEM-085` | Volume Driver | Volume Driver | Volume Driver | **MATCH** | 0.1615 | Consensus across both independent engines |
| `ITEM-087` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.0070 | Consensus across both independent engines |
| `ITEM-090` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.0617 | Consensus across both independent engines |
| `ITEM-101` | Hidden Opportunity | Hidden Opportunity | Hidden Opportunity | **MATCH** | 0.1712 | Consensus across both independent engines |
| `ITEM-102` | Hidden Opportunity | Hidden Opportunity | Hidden Opportunity | **MATCH** | 0.0358 | Consensus across both independent engines |
| `ITEM-109` | Volume Driver | Volume Driver | Volume Driver | **MATCH** | 0.0169 | Consensus across both independent engines |
| `ITEM-138` | Volume Driver | Volume Driver | Volume Driver | **MATCH** | 0.0097 | Consensus across both independent engines |
| `ITEM-141` | Volume Driver | Volume Driver | Volume Driver | **MATCH** | 0.0263 | Consensus across both independent engines |
| `ITEM-142` | Volume Driver | Volume Driver | Volume Driver | **MATCH** | 0.0280 | Consensus across both independent engines |
| `ITEM-146` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.0651 | Consensus across both independent engines |
| `ITEM-002` | Volume Driver | Volume Driver | Volume Driver | **MATCH** | 0.0882 | Consensus across both independent engines |
| `ITEM-004` | Volume Driver | Volume Driver | Volume Driver | **MATCH** | 0.0433 | Consensus across both independent engines |
| `ITEM-045` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.0843 | Consensus across both independent engines |
| `ITEM-055` | Volume Driver | Volume Driver | Volume Driver | **MATCH** | 0.1915 | Consensus across both independent engines |
| `ITEM-060` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.1353 | Consensus across both independent engines |
| `ITEM-068` | Volume Driver | Volume Driver | Volume Driver | **MATCH** | 0.1882 | Consensus across both independent engines |
| `ITEM-074` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.0223 | Consensus across both independent engines |
| `ITEM-075` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.2113 | Consensus across both independent engines |
| `ITEM-080` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.0389 | Consensus across both independent engines |
| `ITEM-089` | Profit Driver | Profit Driver | Profit Driver | **MATCH** | 0.1936 | Consensus across both independent engines |
| `ITEM-091` | Volume Driver | Volume Driver | Volume Driver | **MATCH** | 0.0666 | Consensus across both independent engines |
| `ITEM-097` | Hidden Opportunity | Hidden Opportunity | Hidden Opportunity | **MATCH** | 0.1915 | Consensus across both independent engines |
| `ITEM-108` | Volume Driver | Volume Driver | Volume Driver | **MATCH** | 0.1166 | Consensus across both independent engines |
| `ITEM-114` | Profit Driver | Profit Driver | Profit Driver | **MATCH** | 0.0480 | Consensus across both independent engines |
| `ITEM-116` | Hidden Opportunity | Hidden Opportunity | Hidden Opportunity | **MATCH** | 0.0669 | Consensus across both independent engines |
| `ITEM-118` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.0449 | Consensus across both independent engines |
| `ITEM-131` | Profit Driver | Profit Driver | Profit Driver | **MATCH** | 0.0771 | Consensus across both independent engines |
| `ITEM-001` | Volume Driver | Volume Driver | Volume Driver | **MATCH** | 0.1324 | Consensus across both independent engines |
| `ITEM-005` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.0965 | Consensus across both independent engines |
| `ITEM-013` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.0541 | Consensus across both independent engines |
| `ITEM-014` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.0040 | Consensus across both independent engines |
| `ITEM-021` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.0760 | Consensus across both independent engines |
| `ITEM-022` | Volume Driver | Volume Driver | Volume Driver | **MATCH** | 0.2129 | Consensus across both independent engines |
| `ITEM-027` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.0439 | Consensus across both independent engines |
| `ITEM-031` | Volume Driver | Volume Driver | Volume Driver | **MATCH** | 0.1199 | Consensus across both independent engines |
| `ITEM-032` | Volume Driver | Volume Driver | Volume Driver | **MATCH** | 0.1712 | Consensus across both independent engines |
| `ITEM-095` | Profit Driver | Profit Driver | Profit Driver | **MATCH** | 0.0878 | Consensus across both independent engines |
| `ITEM-106` | Volume Driver | Volume Driver | Volume Driver | **MATCH** | 0.1167 | Consensus across both independent engines |
| `ITEM-122` | Profit Driver | Profit Driver | Profit Driver | **MATCH** | 0.2305 | Consensus across both independent engines |
| `ITEM-134` | Volume Driver | Volume Driver | Volume Driver | **MATCH** | 0.0952 | Consensus across both independent engines |
| `ITEM-149` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.1221 | Consensus across both independent engines |
| `ITEM-003` | Volume Driver | Volume Driver | Volume Driver | **MATCH** | 0.1022 | Consensus across both independent engines |
| `ITEM-030` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.0668 | Consensus across both independent engines |
| `ITEM-034` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.0850 | Consensus across both independent engines |
| `ITEM-036` | Hidden Opportunity | Hidden Opportunity | Hidden Opportunity | **MATCH** | 0.1708 | Consensus across both independent engines |
| `ITEM-037` | Profit Driver | Profit Driver | Profit Driver | **MATCH** | 0.2065 | Consensus across both independent engines |
| `ITEM-038` | Profit Driver | Profit Driver | Profit Driver | **MATCH** | 0.2102 | Consensus across both independent engines |
| `ITEM-048` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.2170 | Consensus across both independent engines |
| `ITEM-052` | Volume Driver | Volume Driver | Volume Driver | **MATCH** | 0.3067 | Consensus across both independent engines |
| `ITEM-063` | Volume Driver | Volume Driver | Volume Driver | **MATCH** | 0.2753 | Consensus across both independent engines |
| `ITEM-093` | Profit Driver | Profit Driver | Profit Driver | **MATCH** | 0.0395 | Consensus across both independent engines |
| `ITEM-098` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.0804 | Consensus across both independent engines |
| `ITEM-099` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.0128 | Consensus across both independent engines |
| `ITEM-100` | Profit Driver | Profit Driver | Profit Driver | **MATCH** | 0.1087 | Consensus across both independent engines |
| `ITEM-107` | Profit Driver | Profit Driver | Profit Driver | **MATCH** | 0.0621 | Consensus across both independent engines |
| `ITEM-113` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.0772 | Consensus across both independent engines |
| `ITEM-117` | Hidden Opportunity | Hidden Opportunity | Hidden Opportunity | **MATCH** | 0.0329 | Consensus across both independent engines |
| `ITEM-124` | Profit Driver | Profit Driver | Profit Driver | **MATCH** | 0.1729 | Consensus across both independent engines |
| `ITEM-135` | Hidden Opportunity | Hidden Opportunity | Hidden Opportunity | **MATCH** | 0.1549 | Consensus across both independent engines |
| `ITEM-139` | Profit Driver | Profit Driver | Profit Driver | **MATCH** | 0.0344 | Consensus across both independent engines |
| `ITEM-150` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.0495 | Consensus across both independent engines |
| `ITEM-006` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.0942 | Consensus across both independent engines |
| `ITEM-008` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.2800 | Consensus across both independent engines |
| `ITEM-018` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.0313 | Consensus across both independent engines |
| `ITEM-023` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.0635 | Consensus across both independent engines |
| `ITEM-029` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.0615 | Consensus across both independent engines |
| `ITEM-040` | Profit Driver | Profit Driver | Profit Driver | **MATCH** | 0.1340 | Consensus across both independent engines |
| `ITEM-042` | Profit Driver | Profit Driver | Profit Driver | **MATCH** | 0.1966 | Consensus across both independent engines |
| `ITEM-050` | Profit Driver | Low Performer | Hidden Opportunity | **MISMATCH** | 0.2475 | Quality-satisfaction divergence: High rating (3.56) and repeat loyalty (5.2%) qualified item as Hidden Opportunity in Python. |
| `ITEM-057` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.0378 | Consensus across both independent engines |
| `ITEM-066` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.0396 | Consensus across both independent engines |
| `ITEM-070` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.1089 | Consensus across both independent engines |
| `ITEM-076` | Volume Driver | Volume Driver | Volume Driver | **MATCH** | 0.1505 | Consensus across both independent engines |
| `ITEM-081` | Profit Driver | Profit Driver | Profit Driver | **MATCH** | 0.1074 | Consensus across both independent engines |
| `ITEM-086` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.0461 | Consensus across both independent engines |
| `ITEM-123` | Profit Driver | Profit Driver | Profit Driver | **MATCH** | 0.1827 | Consensus across both independent engines |
| `ITEM-129` | Profit Driver | Profit Driver | Profit Driver | **MATCH** | 0.0717 | Consensus across both independent engines |
| `ITEM-144` | Low Performer | Low Performer | Low Performer | **MATCH** | 0.0619 | Consensus across both independent engines |

## 3. Methodological Disagreement Analysis

### Key Sources of Non-Identical Classification:
1. **Scaling Geometry:** Spark SQL applied linear min-max normalization, whereas Python utilized `RobustScaler` (median and IQR-based scaling), providing higher resilience against volume outliers.
2. **Quality & Loyalty Weighting:** The Python engine assigned a 15% weight to customer satisfaction ratings and a 10% weight to customer repeat purchase rates, surfacing items with high consumer loyalty as *Hidden Opportunities* even with moderate sales volume.
3. **Wastage Sensitivity:** The Python pipeline incorporated a continuous non-linear wastage penalty function, whereas Spark evaluated wastage against median threshold gates.
