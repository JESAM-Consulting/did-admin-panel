import React from "react";
import { Redirect, Switch, Route } from "react-router-dom";
import { Layout } from "../_metronic/layout";
import BasePage from "./BasePage";
import {  AuthPage } from "./modules/Auth";
import ErrorsPage from "./modules/ErrorsExamples/ErrorsPage";
import Auth from "../helpers/Auth";

export function Routes() {
    return (
        <Switch>
            {!Auth.isUserAuthenticat() ? (
                <Route>
                    <AuthPage />
                </Route>
            ) : (
                <Redirect from="/auth/login" to="/" />
            )}
            <Route path="/error" component={ErrorsPage} />

            {!Auth.isUserAuthenticat() ? (
                <Redirect to="/auth/login" />
            ) : (
                <Layout>
                    <BasePage />
                </Layout>
            )}
        </Switch>
    );
}
