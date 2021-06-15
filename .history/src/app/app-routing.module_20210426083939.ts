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
    path: "accident-scene1",
    loadChildren: () => import("./pages/Accident-scene/accident-scene1/accident-scene1.module").then(m => m.AccidentScene1PageModule) 
  },
  {
    path: "accident-scene2",
    loadChildren: () => import("./pages/Accident-scene/accident-scene2/accident-scene2.module").then(m => m.AccidentScene2PageModule) 
  },
  {
    path: "accident-scene3",
    loadChildren: () => import("./pages/Accident-scene/accident-scene3/accident-scene3.module").then(m => m.AccidentScene3PageModule) 
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
    path: "the-insured",
    loadChildren: () => import("./pages/Accident-scene/the-insured/the-insured.module").then(m => m.TheInsuredPageModule) 
  },
  {
    path: "driver-details",
    loadChildren: () => import("./pages/Accident-scene/driver-details/driver-details.module").then(m => m.DriverDetailsPageModule) 
  },
  {
    path: "vehicle-checklist",
    loadChildren: () => import("./pages/Accident-scene/vehicle-checklist/vehicle-checklist.module").then(m => m.VehicleChecklistPageModule) 
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
