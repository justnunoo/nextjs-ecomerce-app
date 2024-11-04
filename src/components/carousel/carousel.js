// import Image from "next/image";

// export default function CarouselComponent({ images }) {
//   return (
//     <div
//       id="carouselExampleAutoplaying"
//       className="carousel slide"
//       data-bs-ride="carousel"
//     >
//       <div className="carousel-inner">
//         {images.map((image, index) => (
//           <div
//             key={index}
//             className={`carousel-item ${index === 0 ? "active" : ""}`}
//           >
//             <Image
//               src={image.src}
//               alt={image.alt}
//               className="d-block w-100"
//               width={800} // You can adjust the width and height as needed
//               height={400} // Adjust the height as needed
//               priority={index === 0} // Preload the first image for better performance
//             />
//           </div>
//         ))}
//       </div>

//       <button
//         className="carousel-control-prev"
//         type="button"
//         data-bs-target="#carouselExampleAutoplaying"
//         data-bs-slide="prev"
//       >
//         <span className="carousel-control-prev-icon" aria-hidden="true"></span>
//         <span className="visually-hidden">Previous</span>
//       </button>
//       <button
//         className="carousel-control-next"
//         type="button"
//         data-bs-target="#carouselExampleAutoplaying"
//         data-bs-slide="next"
//       >
//         <span className="carousel-control-next-icon" aria-hidden="true"></span>
//         <span className="visually-hidden">Next</span>
//       </button>
//     </div>
//   );
// }


import Image from "next/image";
import styles from './CarouselComponent.module.css'; // Import custom CSS

export default function CarouselComponent({ images }) {
  return (
    <div
      id="carouselExampleAutoplaying"
      className="carousel slide"
      data-bs-ride="carousel"
    >
      <div className="carousel-inner">
        {images.map((image, index) => (
          <div
            key={index}
            className={`carousel-item ${index === 0 ? "active" : ""}`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              className={`d-block w-100 ${styles.carouselImage}`}
              width={800} // Image width; can adjust or leave to auto-scale
              height={400} // Base image height for smaller screens
              objectFit="cover" // Prevent image stretching
              priority={index === 0} // Preload the first image for better performance
            />
          </div>
        ))}
      </div>

      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleAutoplaying"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleAutoplaying"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}
