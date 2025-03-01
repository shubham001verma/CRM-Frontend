import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { Box, Typography } from "@mui/material";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import API_BASE_URL from "../../Config";
const OfferBanner = () => {
  const [banners, setBanners] = useState([]);
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/banner/allbanners`)
      .then((response) => {
        const activeBanners = response.data?.filter(banner => banner.status === "active").slice(0, 3) || [];
        setBanners(activeBanners);
      })
      .catch((error) => {
        console.error("Error fetching banners:", error);
      });
  }, []);

  const settings = {
    dots: true,
    infinite: banners.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: banners.length > 1,
    autoplaySpeed: 3000,
    arrows: false,
  };

  return (
    <Box
      sx={{
        "& .slick-dots li.slick-active button:before": {
          color: "secondary.main",
        },
      }}
    >
      {banners.length === 0 ? (
        <Typography variant="h6" sx={{ py: 3, textAlign: "center" }}>
          No Offers Available
        </Typography>
      ) : (
        <Slider {...settings}>
          {banners.map((banner, index) => (
            <div key={index}>
              <img
                height="auto"
                src={`${API_BASE_URL}/${banner.image}`}
                alt={banner.title}
                style={{
                  width: "100%",
                  objectFit: "cover",
                  cursor: "pointer",
                  borderRadius: "12px",
                }}
              />
            </div>
          ))}
        </Slider>
      )}
    </Box>
  );
};

export default OfferBanner;

