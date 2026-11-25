# Order-to-Audit ERP - Dockerfile
# Centre for Digital Infrastructure, NIT Tiruchirappalli
FROM node:20-alpine

WORKDIR /app

# Copy application and database files
COPY package.json ./
COPY server.js ./
COPY "Order-to-Audit Prototype.html" ./
COPY Project_Presentation.html ./
COPY test_suite.js ./
COPY erp_database.json ./
COPY README.md ./
COPY DESIGN_NOTE.md ./

# Expose ERP Web App port
EXPOSE 3000

# Run automated tests and start server
CMD ["node", "server.js"]
