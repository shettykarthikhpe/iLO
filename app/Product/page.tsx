"use client";
import React, { memo, ReactNode, useEffect, useState } from "react";
import {
  Box,
  Card,
  Typography,
  Tooltip,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Chip,
} from "@mui/material";
import { Grid, styled } from "@mui/system";
import { BsInfoCircle } from "react-icons/bs";
import axios from "axios";
import { redirect } from "next/navigation";
import { CheckCircle, WarningAmber, ErrorOutline } from "@mui/icons-material";

const bgColors: { [key: string]: String } = {
  OK: "#4CAF50",
  pending: "#FFC107",
  "N/A": "#F44336",
};

const statusColors = {
  OK: "success",
  pending: "warning",
  "N/A": "error",
};

const statusIcons = {
  active: <CheckCircle sx={{ color: "#4CAF50", fontsize: 40 }} />,
  pending: <WarningAmber sx={{ color: "FFC107", fontsize: 40 }} />,
  inactive: <ErrorOutline sx={{ color: "#F44336", fontSize: 40 }} />,
};

interface StatCard {
  theme: any;
  status: string;
}
const StatusCard = styled(Card)<StatCard>(({ theme, status }) => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(1.5),
  marginBottom: theme.spacing(1),
  transition: "all 0.3s ease",
  cursor: "pointer",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "black",
  },
  "&::before": {
    content: '""',
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "6px",
    backgroundColor: bgColors[status],
  },
}));

const ContentWrapper = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  paddingLeft: "12px",
});

const statusDescriptions = {
  active: "Product is currently active and running smoothly",
  pending: "Product is awaiting approval or processing",
  inactive: "Product is currently inactive or disabled",
};

interface ProductCard {
  productName: string;
  status: string;
  size: string;
  onClick: any;
  showIcon: boolean;
}

const ProductStatusCard = memo(
  ({
    productName,
    status,
    size = "large",
    onClick,
    showIcon = true,
  }: ProductCard) => {
    const getFontSize = () => {
      switch (size) {
        case "small":
          return "0.875rem";
        case "large":
          return "1.25rem";
        default:
          return "1rem";
      }
    };

    const getPadding = () => {
      switch (size) {
        case "small":
          return 1;
        case "large":
          return 2;
        default:
          return 1.5;
      }
    };

    return (
      <Tooltip title={undefined}>
        <StatusCard
          status={status}
          onClick={onClick}
          sx={{ padding: getPadding() }}
          aria-label={`${productName} - Status: ${status}`}
          theme={undefined}
        >
          <ContentWrapper>
            <Typography
              variant="body1"
              sx={{
                fontSize: getFontSize(),
                fontWeight: 500,
                color: "text.primary",
              }}
            >
              {productName}
            </Typography>
            {showIcon && (
              <BsInfoCircle
                size={getFontSize()}
                style={{
                  marginLeft: "8px",
                  color: "#666",
                }}
              />
            )}
          </ContentWrapper>
        </StatusCard>
      </Tooltip>
    );
  }
);

const ProductStatusDemo = () => {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState([]);
  const [version, setVersion] = useState([]);
  const [cIS, setCIS] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState<number | null>();

  useEffect(() => {
    const value = localStorage.getItem("LoggedIn");
    if (value != "true") {
      redirect("/");
    }
  }, []);

  // devices, stat, healt, names, fversion, cmpIntStatus, locats

  const fetcher = async () => {
    try {
      setLoading(true);
      const resp = await axios.get("http://127.0.0.1:5000/api/table");
      setProducts(resp.data.data[3]);
      setStatus(resp.data.data[2]);
      setVersion(resp.data.data[4]);
      setCIS(resp.data.data[5]);
      setLocation(resp.data.data[6]);
      // console.log(resp.data.data[2])
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetcher();
  }, []);

  return (
    <Box sx={{ marginLeft: 10, marginTop: 5, padding: 2 }}>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {loading && (
          <h1 className="black mt-20 text-align item-center">
            Loading............
          </h1>
        )}
        {!loading &&
          status &&
          products &&
          products.map((product, index) => (
            <ProductStatusCard
              size=""
              showIcon={true}
              key={index}
              productName={product}
              status={status[index]}
              onClick={() => setSelectedProduct(index)}
            />
          ))}
      </Grid>
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
            color: "#555",
          }}
        >
          Product Details
        </DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          {selectedProduct && (
            <>
              <Typography variant="body1" sx={{ color: "#555" }}>
                <strong>Product Name: </strong>
                {products[selectedProduct]}
              </Typography>
              <Typography variant="body1" sx={{ color: "#555" }}>
                <strong>Location:</strong> {location[selectedProduct]}
              </Typography>
              <Typography variant="body1" sx={{ color: "#555" }}>
                <strong>Product Version:</strong> {version[selectedProduct]}
              </Typography>
              <Typography variant="body1" sx={{ color: "#555" }}>
                <strong>Firmware Version:</strong> {version[selectedProduct]}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body1" sx={{ color: "#555" }}>
                  <strong>Component Integrity:</strong>
                </Typography>
                {cIS[selectedProduct]}
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                <Chip
                  label={status[selectedProduct]}
                  color={statusColors[status[selectedProduct]]}
                  sx={{ fontWeight: "bold" }}
                />
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", mt: 2 }}>
          <Button
            onClick={() => setSelectedProduct(null)}
            variant="contained"
            color="primary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductStatusDemo;
