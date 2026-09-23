# NYĀYA — Rule-Based Inference & Reasoning System

An interactive academic web application demonstrating the computational modeling of **Nyāya syllogistic reasoning** (Indian Knowledge Systems) through a **deterministic forward-chaining rule-based inference engine** in Computer Science.

---

## 🏛️ Project Overview

* **IKS Concept**: Nyāya Epistemology (*Anumāna* - inference from sign/smoke to fire).
* **CS Concept**: Rule-Based Expert System & First-Order Horn Clause Logic.
* **Algorithm**: Deterministic Forward Chaining with fixed-point equilibrium detection.
* **Stack**: HTML5, Vanilla JavaScript (ES6+), React 18 (Standalone / htm), TailwindCSS.

---

## 🚀 Getting Started

### 1. Direct Browser Opening
Simply double-click [
yaya.html](./nyaya.html) or [index.html](./index.html) to open in any web browser.

### 2. Local HTTP Server
Run the included Node.js server:
`ash
node server.js
`
Then visit [http://localhost:3000](http://localhost:3000).

---

## 🧪 Running Automated Tests

Run the full 10-case verification test suite from your terminal:
`ash
node tests/inference.test.js
`

---

## 📂 Project Structure

`
├── src/
│   └── engine/
│       ├── types.js            # Data contracts and interface definitions
│       ├── parser.js           # Fact and Definite Rule syntax parser
│       ├── validator.js        # Knowledge base duplicate detection and validation
│       ├── ruleMatcher.js      # Variable substitution (x = Entity) & antecedent unification
│       ├── inferenceEngine.js  # Forward-chaining inference engine & trace recorder
│       └── testSuite.js        # 10 automated test cases
├── tests/
│   └── inference.test.js       # CLI test suite runner
├── index.html                  # Main web application bundle with interactive UI & engine
├── nyaya.html                  # Standalone direct-run HTML application
├── server.js                   # Local dual-stack HTTP server
├── architecture.md             # System architecture and data flow documentation
├── design.md                   # UI design tokens and visual system
└── memory.md                   # Development history and decision logs
`

---

## Conclusion

NyāyaLogic demonstrates how selected reasoning-oriented ideas inspired by the Nyāya tradition can be represented through a deterministic computational inference model. The system accepts explicit facts and rules, applies forward chaining with variable substitution, and produces derived facts together with a step-by-step reasoning trace.

The project provides an interactive way to understand the relationship between traditional reasoning concepts and rule-based computational logic. Its deterministic design makes every inference transparent and reproducible, without relying on black-box AI or automated rule learning.

The implemented system was validated using 10 automated test cases covering basic, multi-step, multiple-fact, duplicate, circular, empty-input, and invalid-input scenarios, with all 10 tests passing.

The current implementation is intentionally limited to a simplified rule-based model and does not represent the complete philosophical or logical system of classical Nyāya. Future extensions could include richer predicates, backward chaining, persistence, and more expressive reasoning.
