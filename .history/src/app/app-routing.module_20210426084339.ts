import { NgModule } from "@angular/core";
import { NoPreloading, PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  { path: "login", loadChildren: "./pages/login/login.module#LoginPageModule" },
  { path: "app", loadChildren: "./pages/tabs/tabs.module#TabsPageModule" },
  { path: "modal", loadChildren: "./modals/modal/modal.module#ModalPageModule" },
  {
    path: "request-modal",
    loadChildren: "./modals/request-modal/request-modal.module#RequestModalPageModule"
  },
  {
    path: "job-desc-modal",
    loadChildren:
      "./modals/job-desc-modal/job-desc-modal.module#JobDescModalPageModule"
  },
  {
    path: "update-password",
    loadChildren: () => import("./pages/update-password/update-password.module").then(m => m.UpdatePasswordPageModule) 
  },
  {
    path: "otp-page",
    loadChildren: () => import("./pages/otp-page/otp-page.module").then(m => m.OtpPagePageModule) 
  },
  {
    path: "select-vehicle",
    loadChildren:
      "./modals//select-vehicle/select-vehicle.module#SelectVehiclePageModule"
  },
  {
    path: "select-tel-number",
    loadChildren: () => import("./pages/select-tel-number/select-tel-number.module").then(m => m.SelectTelNumberPageModule) 
  },
  {
    path: "request-alert",
    loadChildren: () => import("./pages/request-alert/request-alert.module").then(m => m.RequestAlertPageModule) 
  },
  {
    path: "add-number-otp",
    loadChildren: () => import("./modals/add-number-otp/add-number-otp.module").then(m=>m.AddNumberOtpPageModule)
  },
  {
    path: "forgot-password",
    loadChildren: () => import("./pages/forgot-password/forgot-password.module").then(m => m.ForgotPasswordPageModule) 
  },
  {
    path: "job-info",
    loadChildren: "./modals/job-info/job-info.module#JobInfoPageModule"
  },
  { path: 'final-checklist', loadChildren: './pages/Accident-scene/final-checklist/final-checklist.module#FinalChecklistPageModule' },
  { path: 'scene-information', loadChildren: './pages/Accident-scene/scene-information/scene-information.module#SceneInformationPageModule' },
  { path: 'scene-photos', loadChildren: './pages/Accident-scene/scene-photos/scene-photos.module#ScenePhotosPageModule' },
  { path: 'additional-content', loadChildren: './pages/Accident-scene/additional-content/additional-content.module#AdditionalContentPageModule' },
  {
    path: 'motoraccident',
    loadChildren: () => import('./pages/scene/motoraccident/claim-motoraccident.module').then(m => m.ClaimMotorAccidentModule)
  },
  {
    path: 'chat',
    loadChildren: () => import('./pages/chat/chat.module').then( m => m.ChatPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: NoPreloading })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
