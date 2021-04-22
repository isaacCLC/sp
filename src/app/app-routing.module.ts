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
    loadChildren:
      "./pages/Accident-scene/accident-scene1/accident-scene1.module#AccidentScene1PageModule"
  },
  {
    path: "accident-scene2",
    loadChildren:
      "./pages/Accident-scene/accident-scene2/accident-scene2.module#AccidentScene2PageModule"
  },
  {
    path: "accident-scene3",
    loadChildren:
      "./pages/Accident-scene/accident-scene3/accident-scene3.module#AccidentScene3PageModule"
  },
  {
    path: "update-password",
    loadChildren:
      "./pages/update-password/update-password.module#UpdatePasswordPageModule"
  },
  {
    path: "otp-page",
    loadChildren: "./pages/otp-page/otp-page.module#OtpPagePageModule"
  },
  {
    path: "select-vehicle",
    loadChildren:
      "./modals//select-vehicle/select-vehicle.module#SelectVehiclePageModule"
  },
  {
    path: "select-tel-number",
    loadChildren:
      "./pages/select-tel-number/select-tel-number.module#SelectTelNumberPageModule"
  },
  {
    path: "request-alert",
    loadChildren: "./pages/request-alert/request-alert.module#RequestAlertPageModule"
  },
  {
    path: "add-number-otp",
    loadChildren:
      "./modals/add-number-otp/add-number-otp.module#AddNumberOtpPageModule"
  },
  {
    path: "forgot-password",
    loadChildren:
      "./pages/forgot-password/forgot-password.module#ForgotPasswordPageModule"
  },
  {
    path: "the-insured",
    loadChildren: "./pages/Accident-scene/the-insured/the-insured.module#TheInsuredPageModule"
  },
  {
    path: "driver-details",
    loadChildren:
      "./pages/Accident-scene/driver-details/driver-details.module#DriverDetailsPageModule"
  },
  {
    path: "vehicle-checklist",
    loadChildren:
      "./pages/Accident-scene/vehicle-checklist/vehicle-checklist.module#VehicleChecklistPageModule"
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
    RouterModule.forRoot(routes, { preloadingStrategy: NoPreloading  })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
