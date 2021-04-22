import { NgModule } from "@angular/core";
import { NoPreloading, PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  {
    path: 'motoraccident',
    loadChildren: () => import('./pages/scene/motoraccident/claim-motoraccident.module').then(m => m.ClaimMotorAccidentModule)
  },
  {
    path: 'chat',
    loadChildren: () => import('./Pages/chat/chat.module').then(m => m.ChatPageModule)
  },
  { 
    path: "login",
    loadChildren: () => import("./pages/login/login.module").then(m => m.LoginPageModule) 
  },
  { 
    path: "app",
    loadChildren: () => import("./pages/tabs/tabs.module").then(m => m.TabsPageModule)  
  },
  { 
    path: "modal",
     loadChildren: () => import("./Modals/modal/modal.module").then(m => m.ModalPageModule) 
    },
  {
    path: "request-modal",
    loadChildren: () => import("./Modals/request-modal/request-modal.module").then(m => m.RequestModalPageModule) 
  },
  {
    path: "job-desc-modal",
    loadChildren: () => import("./Modals/job-desc-modal/job-desc-modal.module").then(m => m.JobDescModalPageModule) 
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
    loadChildren: () => import("./Modals//select-vehicle/select-vehicle.module").then(m => m.SelectVehiclePageModule) 
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
    loadChildren: () => import("./Modals/add-number-otp/add-number-otp.module").then(m => m.AddNumberOtpPageModule) 
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
    loadChildren: () => import("./Modals/job-info/job-info.module").then(m => m.JobInfoPageModule) 
  },
  { 
    path: 'final-checklist',
     loadChildren: () => import('./pages/Accident-scene/final-checklist/final-checklist.module' ).then(m => m.FinalChecklistPageModule) 
    },
  { 
    path: 'scene-information', 
    loadChildren: () => import('./pages/Accident-scene/scene-information/scene-information.module').then(m => m.SceneInformationPageModule)  
  },
  { 
    path: 'scene-photos',
     loadChildren: () => import('./pages/Accident-scene/scene-photos/scene-photos.module' ).then(m => m.ScenePhotosPageModule) 
    },
  { 
    path: 'additional-content',
     loadChildren: () => import('./pages/Accident-scene/additional-content/additional-content.module').then(m => m.AdditionalContentPageModule) 
    },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: NoPreloading })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
