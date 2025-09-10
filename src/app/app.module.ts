@@ .. @@
 import { NgModule } from '@angular/core';
 import { BrowserModule } from '@angular/platform-browser';
+import { HTTP_INTERCEPTORS } from '@angular/common/http';
 
 import { AppRoutingModule } from './app-routing.module';
 import { AppComponent } from './app.component';
+import { MockInterceptor } from './shared/interceptors/mock.interceptor';
+import { MockAuthService } from './shared/services/mock/mock-auth.service';
+import { MockDataService } from './shared/services/mock/mock-data.service';
+import { MockMenuService } from './shared/services/mock/mock-menu.service';
 
 @NgModule({
   declarations: [
@@ .. @@
   imports: [
     BrowserModule,
-    AppRoutingModule
+    AppRoutingModule,
+    HttpClientModule,
+    FormsModule,
+    ReactiveFormsModule
   ],
-  providers: [],
+  providers: [
+    MockAuthService,
+    MockDataService,
+    MockMenuService,
+    {
+      provide: HTTP_INTERCEPTORS,
+      useClass: MockInterceptor,
+      multi: true
+    }
+  ],
   bootstrap: [AppComponent]
 })
 export class AppModule { }