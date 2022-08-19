<script>
    const url = window.location.pathname
    import { Router, Route } from "svelte-routing";
    import HomePage from "./Components/HomePage.svelte";
    import ProductPage from "./Components/Product/ProductPage.svelte";
    import CartPage from "./Components/Cart/CartPage.svelte";
    import NavBar from './Components/NavBar.svelte'
    import Transition from './Components/Transition.svelte'
    import LoginForm from './Components/Customer/LoginForm.svelte'
    import CustomerPage from "./Components/Customer/CustomerPage.svelte";
    import EditAddress from "./Components/Address/EditAddress.svelte";
    import AddAddress from "./Components/Address/AddAddress.svelte";
    import ProductsPage from './Components/Product/ProductsPage.svelte'
    import RegisterForm from "./Components/Customer/RegisterForm.svelte";
    import OrderPage from "./Components/Order/OrderPage.svelte";
    import Footer from './Components/Footer.svelte'
    import CheckoutPage from './Components/Checkout/CheckoutPage.svelte'
    import CheckoutSummary from "./Components/Checkout/CheckoutSummary.svelte"; 
    import ForgotPassword from './Components/Customer/ForgotPassword.svelte'
    import ResetPassword from './Components/Customer/ResetPassword.svelte' 
    import ChangeCustomerName from './Components/Customer/ChangeName.svelte'
    import ChangeCustomerPassword from './Components/Customer/ChangePassword.svelte'
    import DashboardHome from "./Components/Dashboard/DashboardHome.svelte";
    import DashboardLogin from "./Components/Dashboard/DashboardLogin.svelte";
    import DashboardOrders from "./Components/Dashboard/DashboardOrders.svelte";
    import DashboardProducts from "./Components/Dashboard/DashboardProducts.svelte";
    import NewProduct from "./Components/Dashboard/Products/NewProduct.svelte";
    import EditProduct from "./Components/Dashboard/Products/EditProduct.svelte";
    import DashboardCategories from "./Components/Dashboard/DashboardCategories.svelte";
    import NewCategory from "./Components/Dashboard/Categories/NewCategory.svelte";
    import EditCategory from "./Components/Dashboard/Categories/EditCategory.svelte";
    import AssignNullCategory from "./Components/Dashboard/Products/AssignNullCategory.svelte";
    import DashboardNavBar from "./Components/Dashboard/DashboardNavBar.svelte";
    import DeleteCustomer from "./Components/Customer/DeleteCustomer.svelte";
    import {show_notification} from './Stores/notification'
    import Notification from "./Components/Notification.svelte";
</script>

{#if !url.includes('/dashboard')}
<Router>
<div class = "bg-base-200">
    <div class="max-w-7xl bg-base-100 shadow-2xl mx-auto min-h-screen flex flex-col">
        <div class="pt-3 sticky top-0 z-50">
            <NavBar />
            <div class="relative">
                {#if $show_notification}
                    <Notification />
                {/if}
            </div>
        </div>
        
        <div class="mt-8 mx-3 tablet:mx-6 flex-grow z-0">
            <Route path="/">
                <Transition url={'/'}>
                    <HomePage />
                </Transition>
            </Route>
            <Route path="/product/:id" let:params>
                <Transition url={`/product/${params.id}`}>
                    <ProductPage product_id={params.id} />
                </Transition>
            </Route>
    
            <Route path="/products">
                <Transition url={"/products"}>
                    <ProductsPage />
                </Transition>
            </Route>
    
            <Route path="/cart">
                <Transition url={"/cart"}>
                    <CartPage />
                </Transition>
            </Route>
    
            <Route path="/login">
                <Transition url={"/login"}>
                    <LoginForm />
                </Transition>
            </Route>
    
            <Route path="/register">
                <Transition url={"/register"}>
                    <RegisterForm />
                </Transition>
            </Route>
            
            <Route path="/customer">
                <Transition url={"/customer"}>
                    <CustomerPage />
                </Transition>
            </Route>
    
            <Route path="/customer/changeName/:id" let:params>
                <Transition url={`/customer/changeName/${params.id}`}>
                    <ChangeCustomerName customer_id={params.id} />
                </Transition>
            </Route>
    
            <Route path="/customer/changePassword/:id" let:params>
                <Transition url={`/customer/changeName/${params.id}`}>
                    <ChangeCustomerPassword customer_id={params.id} />
                </Transition>
            </Route>
    
            <Route path="/editAddress/:id" let:params>
                <Transition url={`/editAddress/${params.id}`}>
                    <EditAddress address_id={params.id} />
                </Transition>
            </Route>
    
            <Route path="/addNewAddress">
                <Transition url={"/addNewAddress"}>
                    <AddAddress />
                </Transition>
            </Route>
    
            <Route path="/order/:id" let:params>
                <Transition url={`/order/${params.id}`}>
                    <OrderPage order_id={params.id} />
                </Transition>
            </Route>
    
            <Route path="/checkout">
                <Transition url={"/checkout"}>
                    <CheckoutPage />
                </Transition>
            </Route>
    
            <Route path="/registerCheckout">
                <Transition url={"/registerCheckout"}>
                    <RegisterForm />
                </Transition>
            </Route>
    
            <Route path="/addAddressCheckout">
                <Transition url={"/addAddressCheckout"}>
                    <AddAddress />
                </Transition>
            </Route>
    
            <Route path="/editAddressCheckout/:id" let:params>
                <Transition url={`/editAddressCheckout/${params.id}`}>
                    <EditAddress address_id={params.id} />
                </Transition>
            </Route>
    
            <Route path="/checkoutSummary/:address_id" let:params>
                <Transition url={`/checkoutSummary/${params.address_id}`}>
                    <CheckoutSummary address_id={params.address_id} />
                </Transition>
            </Route>
    
            <Route path="/forgot-password">
                <Transition url={"/forgot-password"}>
                    <ForgotPassword />
                </Transition>
            </Route>
    
            <Route path="/reset-password/:id/:token" let:params>
                <Transition url={`/reset-password/${params.id}/${params.token}`}>
                    <ResetPassword customer_id={params.id} />
                </Transition>
            </Route>

            <Route path="/deleteAccount">
                <Transition url={"/deleteAccount"}>
                    <DeleteCustomer />
                </Transition>
            </Route>
        
        </div>

        <div class="mt-5">
            <Footer />
        </div>
        
    </div>
    
</div>
</Router>
{:else}
<Router>
    <div class="bg-base-200">
        <div class="max-w-7xl bg-base-100 mx-auto min-h-screen flex flex-col ">
            <div class="pt-3 sticky top-0 z-50">
                <DashboardNavBar />
            </div>
            <div class="mt-5 mx-6 flex-grow z-0 mb-10">
                <Route path="/dashboard">
                    <DashboardHome />
                </Route>
    
                <Route path="/dashboard/login">
                    <DashboardLogin />
                </Route>

                <Route path="/dashboard/orders">
                    <DashboardOrders />
                </Route>

                <Route path="/dashboard/products">
                    <DashboardProducts />
                </Route>

                <Route path="/dashboard/newProduct">
                    <NewProduct />
                </Route>

                <Route path="/dashboard/editProduct/:product_id" let:params>
                    <EditProduct product_id={params.product_id}/>
                </Route>

                <Route path="/dashboard/categories">
                    <DashboardCategories />
                </Route>

                <Route path="/dashboard/newCategory">
                    <NewCategory />
                </Route>

                <Route path="/dashboard/editCategory/:category_id" let:params>
                    <EditCategory category_id={params.category_id}/>
                </Route>

                <Route path="/dashboard/assignCategory">
                    <AssignNullCategory />
                </Route>
                
            </div>
        </div>
    </div>
    
    
</Router>
{/if}


