"use client"; // Mark this as a client component

import { useState } from "react";
import { Card } from "react-bootstrap";

// Default image URL
const defaultImage = "https://via.placeholder.com/150"; // Replace with your own default image URL

export default function CardComponent({ image, name, price, brand }) {
  const [show, setShow] = useState(false);

  const toggleShow = () => setShow(!show);

  // Check if the image is a valid URL or path
  const imageSrc = image && image !== "" ? image : defaultImage;

  return (
    <Card
      style={{ width: "100%", marginBottom: "20px" }}
      onMouseOver={toggleShow}
      onMouseOut={toggleShow}
    >
      {/* Use the `image` prop if it exists, otherwise use the default image */}
      <Card.Img
        variant="top"
        src={imageSrc}
        alt={`${name}'s image`}
        style={{ height: "300px", objectFit: "cover" }}
      />

      {show && (
        <Card.Body>
          {/* Conditionally render the brand if it exists */}
          {brand && <Card.Text>{brand}</Card.Text>}

          <Card.Title>{name}</Card.Title>

          {/* Conditionally render the price if it exists */}
          {price !== undefined && (
            <Card.Text>
              <strong>{price}</strong>
            </Card.Text>
          )}
        </Card.Body>
      )}
    </Card>
  );
}
