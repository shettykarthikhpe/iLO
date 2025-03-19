"use client"
import React, { memo, ReactNode, useState } from "react";
import { Box, Card, Typography, Tooltip, DialogTitle, Dialog, DialogContent, DialogActions, Button, Chip } from "@mui/material";
import { Grid, styled } from "@mui/system";
import { BsCheckCircle, BsInfoCircle } from "react-icons/bs";
import { CheckCircle, WarningAmber, ErrorOutline } from "@mui/icons-material";
 
const StatusCard = styled(Card)(({ theme, status }) => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(1.5),
  marginBottom: theme.spacing(1),
  transition: "all 0.3s ease",
  cursor: "pointer",
  height: "70px", 
  overflow: "hidden",
  textOverflow: "ellipsis",
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

const statusColors = {
  active: "success",
  pending: "warning",
  inactive: "error",
};

const statusIcons = {
  active: <CheckCircle sx={{color: "#4CAF50", fontsize: 40}}/>,
  pending: <WarningAmber sx={{color: "FFC107", fontsize: 40}}/>,
  inactive: <ErrorOutline sx={{color: "#F44336", fontSize: 40}}/>,
}

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
              color: "text.primary",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "80%"
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

const componentIntegrityIcons = {
  success: <CheckCircle sx={{color: "#4CAF50", fontsize: "1.5rem"}}/>,
  not_supported: <WarningAmber sx={{color: "FFC107", fontsize: "1.5rem"}}/>,
  failed: <ErrorOutline sx={{color: "#F44336", fontSize: "1.5rem"}}/>,
}

const ProductStatusDemo = () => {
  const [selectedProduct, setSelectedProduct] = useState<{
    location: ReactNode;
    productVersion: ReactNode;
    firmwareVersion: ReactNode;
    componentIntegrityStatus: any; name: string, status: string
} | null>(null);
  
  const products = [
    { name: "12 E3S 32G x4NVMe UBM5 EC BP	", 
      status: "active",
      location: "Slot=5:Port=4:Box=1",
      firmwareVersion: "1.06",
      componentIntegrityStatus: "success"
    },
    { name: "8 SFF 24G x1NVMe/SAS UBM3 BC BP", 
      status: "active",
      location: "Slot=5:Port=4:Box=1",
      firmwareVersion: "1.06",
      componentIntegrityStatus: "not_supported"
    },
    { name: "12 E3S 32G x4NVMe UBM5 EC BP	", 
      status: "active",
      location: "Slot=5:Port=4:Box=1",
      firmwareVersion: "1.06",
      componentIntegrityStatus: "failed"
    },
    { name: "Cloud Storage Service", status: "active" },
    { name: "Cloud Storage Service", status: "active" },
    { name: "8 SFF 24G x1NVMe/SAS UBM3 BC BP", 
      status: "pending",
      location: "Slot=5:Port=4:Box=1",
      firmwareVersion: "1.06",
      componentIntegrityStatus: "not_supported"},
    { name: "Cloud Storage Service", status: "pending" },
    { name: "Cloud Storage Service", status: "active" },
    { name: "Cloud Storage Service", status: "active" },
    { name: "Cloud Storage Service", status: "inactive" },
    { name: "Cloud Storage Service", status: "active" },
    { name: "12 E3S 32G x4NVMe UBM5 EC BP	", 
      status: "inactive",
      location: "Slot=5:Port=4:Box=1",
      firmwareVersion: "1.06",
      componentIntegrityStatus: "failed"
    }
  ];
 
  return (
    <Box
    sx={{
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-between",
      gap: 2, 
      padding: 2,
    }}
  >
    {products.map((product, index) => (
      <Box
        key={index}
        sx={{
          flex: "1 1 calc(25% - 16px)", 
          minWidth: "250px",
          maxWidth: "25%", 
        }}
      >
        <ProductStatusCard
          productName={product.name}
          status={product.status}
          onClick={() => setSelectedProduct(product)} size={""} showIcon={false}/>
      </Box>
    ))}
  <Dialog
  open={Boolean(selectedProduct)}
  onClose={() => setSelectedProduct(null)}
  fullWidth
  maxWidth="sm"
>
  <DialogTitle
    sx={{
      textAlign: "center",
      fontWeight: "bold",
      mb: 1,
      borderBottom: "1px solid #eee",
      color: "#555"
    }}
  >
    Product Details
  </DialogTitle>
  <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
    {selectedProduct && (
      <>
        <Typography variant="body1" sx={{ color: "#555" }}>
          <strong>Product Name: </strong>{selectedProduct.name}
        </Typography>
        <Typography variant="body1" sx={{ color: "#555" }}>
          <strong>Location:</strong> {selectedProduct.location}
        </Typography>
        <Typography variant="body1" sx={{ color: "#555" }}>
          <strong>Product Version:</strong> {selectedProduct.productVersion}
        </Typography>
        <Typography variant="body1" sx={{ color: "#555" }}>
          <strong>Firmware Version:</strong> {selectedProduct.firmwareVersion}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body1" sx={{ color: "#555" }}>
            <strong>Component Integrity:</strong> 
          </Typography>
          {componentIntegrityIcons[selectedProduct.componentIntegrityStatus]}
          {selectedProduct.componentIntegrityStatus}
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
          <Chip
            label={selectedProduct.status.toUpperCase()}
            color={statusColors[selectedProduct.status]}
            sx={{ fontWeight: "bold" }}
          />
        </Box>
      </>
    )}
  </DialogContent>
  <DialogActions sx={{ justifyContent: "center", mt: 2 }}>
    <Button onClick={() => setSelectedProduct(null)} variant="contained" color="primary">
      Close
    </Button>
  </DialogActions>
</Dialog>
  </Box>
  );
};
 
export default ProductStatusDemo;
