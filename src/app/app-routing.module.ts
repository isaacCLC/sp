import { NgModule } from "@angular/core";
import { NoPreloading, PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  { path: "login", loadChildren: "./Pages/login/login.module#LoginPageModule" },
  { path: "app", loadChildren: "./Pages/tabs/tabs.module#TabsPageModule" },
  { path: "modal", loadChildren: "./Modals/modal/modal.module#ModalPageModule" },
  {
    path: "request-modal",
    loadChildren: "./Modals/request-modal/request-modal.module#RequestModalPageModule"
  },
  {
    path: "job-desc-modal",
    loadChildren:
      "./Modals/job-desc-modal/job-desc-modal.module#JobDescModalPageModule"
  },
  {
    path: "accident-scene1",
    loadChildren:
      "./Pages/Accident-scene/accident-scene1/accident-scene1.module#AccidentScene1PageModule"
  },
  {
    path: "accident-scene2",
    loadChildren:
      "./Pages/Accident-scene/accident-scene2/accident-scene2.module#AccidentScene2PageModule"
  },
  {
    path: "accident-scene3",
    loadChildren:
      "./Pages/Accident-scene/accident-scene3/accident-scene3.module#AccidentScene3PageModule"
  },
  {
    path: "update-password",
    loadChildren:
      "./Pages/update-password/update-password.module#UpdatePasswordPageModule"
  },
  {
    path: "otp-page",
    loadChildren: "./Pages/otp-page/otp-page.module#OtpPagePageModule"
  },
  {
    path: "select-vehicle",
    loadChildren:
      "./Modals//select-vehicle/select-vehicle.module#SelectVehiclePageModule"
  },
  {
    path: "select-tel-number",
    loadChildren:
      "./Pages/select-tel-number/select-tel-number.module#SelectTelNumberPageModule"
  },
  {
    path: "request-alert",
    loadChildren: "./Pages/request-alert/request-alert.module#RequestAlertPageModule"
  },
  {
    path: "add-number-otp",
    loadChildren:
      "./Modals/add-number-otp/add-number-otp.module#AddNumberOtpPageModule"
  },
  {
    path: "forgot-password",
    loadChildren:
      "./Pages/forgot-password/forgot-password.module#ForgotPasswordPageModule"
  },
  {
    path: "the-insured",
    loadChildren: "./Pages/Accident-scene/the-insured/the-insured.module#TheInsuredPageModule"
  },
  {
    path: "driver-details",
    loadChildren:
      "./Pages/Accident-scene/driver-details/driver-details.module#DriverDetailsPageModule"
  },
  {
    path: "vehicle-checklist",
    loadChildren:
      "./Pages/Accident-scene/vehicle-checklist/vehicle-checklist.module#VehicleChecklistPageModule"
  },
  {
    path: "job-info",
    loadChildren: "./Modals/job-info/job-info.module#JobInfoPageModule"
  },
  { path: 'final-checklist', loadChildren: './Pages/Accident-scene/final-checklist/final-checklist.module#FinalChecklistPageModule' },
  { path: 'scene-information', loadChildren: './Pages/Accident-scene/scene-information/scene-information.module#SceneInformationPageModule' },
  { path: 'scene-photos', loadChildren: './Pages/Accident-scene/scene-photos/scene-photos.module#ScenePhotosPageModule' },
  { path: 'additional-content', loadChildren: './Pages/Accident-scene/additional-content/additional-content.module#AdditionalContentPageModule' },
  {
    path: 'motoraccident',
    loadChildren: () => import('./pages/scene/motoraccident/claim-motoraccident.module').then(m => m.ClaimMotorAccidentModule)
  },
  {
    path: 'chat',
    loadChildren: () => import('./Pages/chat/chat.module').then( m => m.ChatPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: NoPreloading  })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
