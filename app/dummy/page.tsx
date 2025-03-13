"use client"
import React, { memo } from "react";
import { Box, Card, Typography, Tooltip } from "@mui/material";
import { Grid, styled } from "@mui/system";
import { BsInfoCircle } from "react-icons/bs";
 
const StatusCard = styled(Card)(({ theme, status }) => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(1.5),
  marginBottom: theme.spacing(1),
  transition: "all 0.3s ease",
  cursor: "pointer",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "black"
  },
  "&::before": {
    content: '""',
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "6px",
    backgroundColor: {
      active: "#4CAF50",
      pending: "#FFC107",
      inactive: "#F44336"
    }[status]
  }
}));
 
const ContentWrapper = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  paddingLeft: "12px"
});
 
const statusDescriptions = {
  active: "Product is currently active and running smoothly",
  pending: "Product is awaiting approval or processing",
  inactive: "Product is currently inactive or disabled"
};
 
const ProductStatusCard = memo(({
  productName,
  status,
  size = "large",
  onClick,
  showIcon = true
}) => {
  const getFontSize = () => {
    switch(size) {
      case "small": return "0.875rem";
      case "large": return "1.25rem";
      default: return "1rem";
    }
  };
 
  const getPadding = () => {
    switch(size) {
      case "small": return 1;
      case "large": return 2;
      default: return 1.5;
    }
  };
 
  return (
    <Tooltip title={statusDescriptions[status]} arrow placement="top">
      <StatusCard
        status={status}
        onClick={onClick}
        sx={{ padding: getPadding() }}
        aria-label={`${productName} - Status: ${status}`}
      >
        <ContentWrapper>
          <Typography
            variant="body1"
            sx={{
              fontSize: getFontSize(),
              fontWeight: 500,
              color: "text.primary"
            }}
          >
            {productName}
          </Typography>
          {showIcon && (
            <BsInfoCircle
              size={getFontSize()}
              style={{
                marginLeft: "8px",
                color: "#666"
              }}
            />
          )}
        </ContentWrapper>
      </StatusCard>
    </Tooltip>
  );
});
 
const ProductStatusDemo = () => {
  const products = [
    { name: "Cloud Storage Service", status: "active" },
    { name: "Analytics Dashboard", status: "pending" },
    { name: "Authentication API", status: "inactive" },
    { name: "Cloud Storage Service", status: "active" },
    { name: "Analytics Dashboard", status: "pending" },
    { name: "Authentication API", status: "inactive" },
    { name: "Cloud Storage Service", status: "active" },
    { name: "Analytics Dashboard", status: "pending" },
    { name: "Authentication API", status: "inactive" },
    { name: "Cloud Storage Service", status: "active" },
    { name: "Analytics Dashboard", status: "pending" },
    { name: "Authentication API", status: "inactive" }
  ];
 
  return (
  <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
  {products.map((product, index) => (
          <Grid item xs={2} sm={4} md={4} key={index}>
          <ProductStatusCard
            key={index}
            productName={product.name}
            status={product.status}
            onClick={() => console.log(`Clicked: ${product.name}`)}
          />
          </Grid>
        ))}
  </Grid>
  );
};
 
export default ProductStatusDemo;