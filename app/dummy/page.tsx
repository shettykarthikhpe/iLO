"use client"
import React, { memo, useEffect, useState } from "react";
import { Box, Card, Typography, Tooltip } from "@mui/material";
import { Grid, styled } from "@mui/system";
import { BsInfoCircle } from "react-icons/bs";
import axios from "axios";
 
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
      'OK': "#4CAF50",
      pending: "#FFC107",
      'N/A': "#F44336"
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

interface ProductCard{
  productName: string;
  status: string;
  size: string;
  onClick: any;
  showIcon: boolean;
}
 
const ProductStatusCard = memo(({productName, status, size = "large", onClick, showIcon = true}:ProductCard) => {
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
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState([])
  const [loading, setLoading] = useState(false);

  const fetcher = async()=>{
    try{
      setLoading(true)
      const resp = await axios.get("http://127.0.0.1:5000/api/table");
      setProducts(resp.data.data[3]);
      setStatus(resp.data.data[2]);
      // console.log(resp.data.data[2])
      setLoading(false)
    }catch(err){
      console.log(err)
      setLoading(false)
    }
  }

  useEffect(()=>{
    fetcher()
  },[]);
 
 
  return (
  <Box sx={{ marginLeft: 10, marginTop:5, padding: 2 }}>
    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
    {loading && <h1 className="black mt-20 text-align item-center">Loading............</h1>}
  {!loading && status && products && products.map((product, index) => (
          <ProductStatusCard
            size=""
            showIcon={true}
            key={index}
            productName={product}
            status={status[index]}
            onClick={() => console.log(`Clicked: ${product}`)}
          />
        ))}
  </Grid>
  </Box>
  );
};
 
export default ProductStatusDemo;