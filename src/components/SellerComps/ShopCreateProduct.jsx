import CreateProduct from "./CreateProduct";
import SellerLayout from "./SellerLayout";

function ShopCreateProduct() {
  return (
    <SellerLayout
      active={4}
      title="Add car part"
      subtitle="List a CarPart with price, stock, category and vehicle compatibility."
    >
      <CreateProduct />
    </SellerLayout>
  );
}

export default ShopCreateProduct;
