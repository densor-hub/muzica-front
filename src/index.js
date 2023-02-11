import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React, { lazy, Suspense } from 'react';
import { AuthContextProvider } from './contexts/AuthContext';

import PublicRoute from './customRoutes/public-routes';
import PrivateRoute from './customRoutes/PrivateRoutes';
import VerifyWebsite from './customRoutes/Verify-website-route';
import Loading from './components/micro-components/loading';
import useAuth from './customHooks/useAuth';
import NoRouteFound from './customRoutes/NoRouteFound';

const CreateWebsite = lazy(() => { return import('./components/create-website') });
const SignIn = lazy(() => { return import('./components/micro-components/signin') });
const SignUp = lazy(() => { return import('./components/micro-components/signup') });
const SignOut = lazy(() => { return import('./components/micro-components/sign-out') });
const HomePage = lazy(() => { return import('./components/micro-components/landing-home') });
const Profile = lazy(() => { return import('./components/Private-Sites/Dashboard-page') });

const AddedAudios = lazy(() => { return import('./components/Private-Sites/added-audios') });
const EditAdudio = lazy(() => { return import('./components/Private-Sites/sub-compoments/edit-audio') });
const AddNewAudio = lazy(() => { return import('./components/Private-Sites/sub-compoments/add-audio') });

const AddedImages = lazy(() => { return import('./components/Private-Sites/added-images') });
const AddNewImage = lazy(() => { return import('./components/Private-Sites/sub-compoments/add-image') });

const AddedVideos = lazy(() => { return import('./components/Private-Sites/added-videos') });
const EditVideo = lazy(() => { return import('./components/Private-Sites/sub-compoments/edit-video') });
const AddNewVideo = lazy(() => { return import('./components/Private-Sites/sub-compoments/add-video') })

const AddedUpcoming = lazy(() => { return import('./components/Private-Sites/added-upcoming') });
const AddNewUpcoming = lazy(() => { return import('./components/Private-Sites/sub-compoments/add-upcoming') })
const EditUpcoming = lazy(() => { return import('./components/Private-Sites/sub-compoments/edit-upcoming') })

const AddedNews = lazy(() => { return import('./components/Private-Sites/added-news') });
const EditNews = lazy(() => { return import('./components/Private-Sites/sub-compoments/edit-news') });
const AddNews = lazy(() => { return import('./components/Private-Sites/sub-compoments/add-News') });

const AddedBiography = lazy(() => { return import('./components/Private-Sites/added-biography') });
const EditBiography = lazy(() => { return import('./components/Private-Sites/sub-compoments/edit-biography') });

const AddedSocials = lazy(() => { return import('./components/Private-Sites/added-socials') });

const Settings = lazy(() => { return import('./components/Private-Sites/settings-site') });
const ResetPasswordPrivate = lazy(() => { return import('./components/Private-Sites/reset-password') });
const ResetPasswordPublic = lazy(() => { return import('./components/Public-sites/reset-password-public') });

const EnterRegistrationCode = lazy(() => { return import('./components/micro-components/submitCodeRegistration') });
const HomeRoute = lazy(() => { return import('./customRoutes/HomeRoute') });


const AppRoutes = () => {
    const { auth } = useAuth();

    return (
        <>
            <Suspense fallback={<Loading />}>
                <Routes>
                    <Route path='/' element={<PublicRoute />}>
                        <Route path='/' element={<HomePage />}></Route>
                        <Route path='login' element={<SignIn />}></Route>
                        <Route path='register' element={<SignUp />}></Route>
                        <Route path='webpage' element={<VerifyWebsite />}></Route>
                        <Route path='audios' element={<VerifyWebsite />}></Route>
                        <Route path='videos' element={<VerifyWebsite />}></Route>
                        <Route path='images' element={<VerifyWebsite />}></Route>
                        <Route path='upcoming' element={<VerifyWebsite />}></Route>
                        <Route path='news' element={<VerifyWebsite />}></Route>
                        <Route path='contact' element={<VerifyWebsite />}></Route>
                        <Route path='reset-password' element={<ResetPasswordPublic />}></Route>
                        <Route path='submit-verfification-code' element={<EnterRegistrationCode />}></Route>
                        <Route path='home' element={<HomeRoute />}></Route>

                    </Route>

                    <Route path={`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}`} element={<PrivateRoute />}>
                        <Route path={`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}`} element={<Profile />}></Route>
                        <Route path={`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/createwebsite`} element={<CreateWebsite />}></Route>

                        <Route path={`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/added-audios`} element={<AddedAudios />}></Route>
                        <Route path={`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/add-audio`} element={<AddNewAudio />}></Route>
                        <Route path={`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/edit-audio:Id`} element={<EditAdudio />}></Route>

                        <Route path={`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/added-videos`} element={<AddedVideos />}></Route>
                        <Route path={`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/add-video`} element={<AddNewVideo />}></Route>
                        <Route path={`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/edit-video:Id`} element={<EditVideo />}></Route>

                        <Route path={`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/added-images`} element={<AddedImages />}></Route>
                        <Route path={`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/add-image`} element={<AddNewImage />}></Route>

                        <Route path={`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/added-upcoming`} element={<AddedUpcoming />}></Route>
                        <Route path={`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/add-upcoming`} element={<AddNewUpcoming />}></Route>
                        <Route path={`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/edit-upcoming:Id`} element={<EditUpcoming />}></Route>


                        <Route path={`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/added-news`} element={<AddedNews />}></Route>
                        <Route path={`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/add-news`} element={<AddNews />}></Route>
                        <Route path={`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/edit-news:Id`} element={<EditNews />}></Route>

                        <Route path={`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/added-biography`} element={<AddedBiography />}></Route>
                        <Route path={`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/edit-biography:Id`} element={<EditBiography />}></Route>

                        <Route path={`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/added-contact`} element={<AddedSocials />}></Route>


                        <Route path={`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/settings`} element={<Settings />}></Route>
                        <Route path={`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/change-password`} element={<ResetPasswordPrivate />}></Route>

                        <Route path={`/${auth?.stagenameInUrl?.trim()?.toLowerCase()}/sign-out`} element={<SignOut />}></Route>

                    </Route>

                    <Route path='*' element={<NoRouteFound />}></Route>


                </Routes>
            </Suspense>
        </>
    )
}

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <AuthContextProvider>
            <AppRoutes />
        </AuthContextProvider>
    </BrowserRouter>

);
