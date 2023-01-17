import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute, LayoutSplashScreen } from "../_metronic/layout";
import DashboardPage from "./pages/DashboardPage";
import Users from "../_metronic/components/Users/Users";
import { getUserInfo } from "../utils/user.util";
import PropertyManagement from "../_metronic/components/PropertyManagement/PropertyManagement";
import Contact from "../_metronic/components/Contact/Contact";
import ManageProperty from "../_metronic/components/ManageProperty/ManageProperty";
import Apraisal from "../_metronic/components/Apraisal/Apraisal";
import SearchQueary from "../_metronic/components/Search_queary/SearchQueary";
import Licensepartner from "../_metronic/components/License_partner/Licensepartner";
import Subscribe from "../_metronic/components/Subscribe/Subscribe";
import Companies from "../_metronic/components/Companies/Companies";
import Content from "../_metronic/components/Content/Content";

export default function BasePage() {

  const UserInfo = getUserInfo();
  console.log("UserInfo", UserInfo?.role === "admin")
  return (
    <>
      <Suspense fallback={<LayoutSplashScreen />}>
        <Switch>
          {UserInfo && UserInfo?.role?.roleName === "admin" ? <Redirect exact from="/" to="/property-management" /> : <Redirect exact from="/" to="/apraisal" />}

          <ContentRoute exact path="/dashboard" component={DashboardPage} children={undefined} render={undefined} />
          <ContentRoute exact path="/users" component={Users} children={undefined} render={undefined} />
          <ContentRoute exact path="/property-management" component={PropertyManagement} children={undefined} render={undefined} />
          <ContentRoute exact path="/manage-property" component={ManageProperty} children={undefined} render={undefined} />
          <ContentRoute exact path="/contact-us" component={Contact} children={undefined} render={undefined} />
          <ContentRoute exact path="/apraisal" component={Apraisal} children={undefined} render={undefined} />
          <ContentRoute exact path="/search-query" component={SearchQueary} children={undefined} render={undefined} />
          <ContentRoute exact path="/license-partner" component={Licensepartner} children={undefined} render={undefined} />
          <ContentRoute exact path="/subscribe" component={Subscribe} children={undefined} render={undefined} />
          <ContentRoute exact path="/content" component={Content} children={undefined} render={undefined} />
          <ContentRoute exact path="/companies" component={Companies} children={undefined} render={undefined} />

          <Redirect to="error/error-v6" />
        </Switch>
      </Suspense>
    </>
  );
}
