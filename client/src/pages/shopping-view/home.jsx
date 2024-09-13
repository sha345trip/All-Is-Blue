import { Button } from "@/components/ui/button";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Home,
  Instagram,
  Mail,
  Phone,
  Youtube,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";

const categoriesWithIcon = [
  { id: "men", label: "Vases", backgroundImage:'/1.jpg' },
  { id: "women", label: "Plates & Mugs", backgroundImage:'/2.jpg'},
  { id: "kids", label: "Lamps", backgroundImage:'/3.jpg'},
  { id: "accessories", label: "Oil Diffuser", backgroundImage:'/4.jpg'},
  { id: "footwear", label: "Decoratives", backgroundImage:'/5.jpg'},
];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { featureImageList } = useSelector((state) => state.commonFeature);

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
    }, 15000);

    return () => clearInterval(timer);
  }, [featureImageList]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  console.log(productList, "productList");

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen bg-yell">
      <div className="relative w-full h-[600px] overflow-hidden">
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map((slide, index) => (
              <img
                src={slide?.image}
                key={index}
                className={`${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
              />
            ))
          : null}
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) =>
                (prevSlide - 1 + featureImageList.length) %
                featureImageList.length
            )
          }
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide + 1) % featureImageList.length
            )
          }
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>
      <section className="py-12 bg-yell">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Shop by category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoriesWithIcon.map((categoryItem) => (
              <Card
                onClick={() =>
                  handleNavigateToListingPage(categoryItem, "category")
                }
                className="relative cursor-pointer hover:shadow-lg transition-shadow h-64"
                style={{
                  backgroundImage: `url(${categoryItem.backgroundImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                 // Adjust this value to increase or decrease opacity
                }}
              >
                <CardContent className="flex flex-col justify-end p-6" >
                  <span className="absolute bottom-4 text-white font-bold text-2xl ">{categoryItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Feature Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList && productList.length > 0
              ? productList.map((productItem) => (
                  <ShoppingProductTile
                    handleGetProductDetails={handleGetProductDetails}
                    product={productItem}
                    handleAddtoCart={handleAddtoCart}
                  />
                ))
              : null}
          </div>
        </div>
      </section>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
       <section className="py-12 relative bg-cover bg-center" style={{ backgroundImage:`url("/1.jpg")`}}>
       <div className="absolute inset-0 bg-black opacity-50"></div> 
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-3xl font-bold text-center mb-8 text-white ">
           About Us
          </h2>
         <div>
         <p className="text-bold text-2xl text-white text-center " > "House to Home: Where Tradition Meets Elegance.” </p>
          <p className="text-2xl mx-4 text-white " >Welcome to All Blue, where tradition meets elegance. Our exquisite collection features authentic Jaipur blue pottery, crafted by skilled artisans preserving a centuries-old heritage.From vibrant mugs to intricate vases, each piece adds a touch of sophistication to your home. We are dedicated to quality and authenticity,supporting local craftsmanship.Transform your house into a home with our timeless, handcrafted blue pottery.</p>
         </div>
        </div>
      </section>
      <section className="py-12 relative bg-cover bg-center bg-custom ">
  <div className="container mx-auto px-4 relative z-10 text-sona ">
    <h2 className="text-3xl font-bold text-center mb-8">Contact Us</h2>
    <div className="flex gap-8">
      {/* First Section: Instagram, Phone, and YouTube */}
      <div className="flex flex-col items-start gap-4 w-1/2">
        <div className="flex items-center space-x-2">
          <Instagram className="w-8 h-8" />
          <span><a href="https://www.instagram.com/all__blueee?igsh=MWpqam44NzlsdHM3bA==" target="_blank" >Instagram</a></span>
        </div>
        <div className="flex items-center space-x-2">
          <Phone className="w-8 h-8" />
          <span><p> 6367485143 </p>
             8278692437 </span>
        </div>
        <div className="flex items-center space-x-2">
          <Youtube className="w-8 h-8" />
          <span><a href="https://youtube.com/@allblueee?si=RGW14tPR21rU-C3x" target="_blank" >YouTube </a></span>
        </div>
      </div>
      
      {/* Second Section: Address and Email */}
      <div className="flex flex-col items-start gap-4 w-1/2">
        <div className="flex items-center space-x-2">
          <Home className="w-10 h-10" />
          <span>let's rebuild this. Inside the contact us section, I want three sections , one containing the instagram, phone and youtube.</span>
        </div>
        <div className="flex items-center space-x-2">
          <Mail className="w-8 h-8" />
          <span>G-Mail: allblueee2024@gmail.com</span>
        </div>
      </div>
    </div>
  </div>
  <p className="text-sona text-center " >&copy; All Blue 2024-25 </p>
</section>
    </div>
  );
}

export default ShoppingHome;
