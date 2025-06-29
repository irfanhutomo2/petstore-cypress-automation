# Petstore API Automation (Cypress)

## Tentang Project

Project ini adalah automation testing untuk API [Petstore Swagger](https://petstore.swagger.io/#/).

## Tools & Dependency

- Cypress (API testing - JavaScript/Node.js)
- Mochawesome (HTML reporter)
- Semua dependency ada di `package.json`

## Cara Menjalankan Automation

1. Install:

    npm install cypress --save-dev
    npm install mochawesome mochawesome-merge mochawesome-report-generator --save-dev

2.	Jalankan semua test:

    npx cypress run

4.	Buka hasil HTML report:
     •	File: cypress/reports/merged-report.html
