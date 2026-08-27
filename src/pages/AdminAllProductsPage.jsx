import AdminLayout from "../components/AdminComps/AdminLayout";
import AdminAllProducts from "../components/AdminComps/AdminAllProducts";

function AdminAllProductsPage() {
  return (
    <AdminLayout
      active={5}
      title="All car parts"
      subtitle="Everything listed across the marketplace."
    >
      <AdminAllProducts />
    </AdminLayout>
  );
}

export default AdminAllProductsPage;
