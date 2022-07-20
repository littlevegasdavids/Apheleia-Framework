<script>
    import { Router, Route, Link } from "svelte-routing";
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
</script>
<Router>
<div class="max-w-7xl mx-auto bg-base-200 min-h-screen">
    <NavBar />
    <div class="mt-5 mx-3 tablet:mx-6">
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

        <Route path="/regiserCheckout">
            <Transition url={"/regiserCheckout"}>
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

    </div>
</div>

</Router>

