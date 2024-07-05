import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Route, RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS  } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { SingupComponent } from './auth/singup/singup.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { BenefitSectionComponent } from './components/benefit-section/benefit-section.component';
import { FooterComponent } from './components/footer/footer.component';
import { TopSellersComponent } from './components/top-sellers/top-sellers.component';
import { SerieAComponent } from './components/serie-a/serie-a.component';
import { PremierLeagueComponent } from './components/premier-league/premier-league.component';
import { Ligue1Component } from './components/ligue1/ligue1.component';
import { BundesligaComponent } from './components/bundesliga/bundesliga.component';
import { LaLigaComponent } from './components/la-liga/la-liga.component';
import { TopChampionshipsComponent } from './components/top-championships/top-championships.component';
import { CatalogueSerieAComponent } from './components/catalogue-serie-a/catalogue-serie-a.component';
import { CataloguePremierLeagueComponent } from './components/catalogue-premier-league/catalogue-premier-league.component';
import { CatalogueLigue1Component } from './components/catalogue-ligue1/catalogue-ligue1.component';
import { CatalogueLaLigaComponent } from './components/catalogue-la-liga/catalogue-la-liga.component';
import { CatalogueBundesligaComponent } from './components/catalogue-bundesliga/catalogue-bundesliga.component';
import { CatalogueRetroComponent } from './components/catalogue-retro/catalogue-retro.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { TokenInterceptor } from './auth/token.interceptor';
import { AuthService } from './auth/auth.service';
import { AccountComponent } from './components/account/account.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { AllProductComponent } from './components/all-product/all-product.component';
import { AllUserComponent } from './components/all-user/all-user.component';
import { PaymentSuccessComponent } from './components/payment-success/payment-success.component';
import { PaymentCancelComponent } from './components/payment-cancel/payment-cancel.component';




const routes: Route[] = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SingupComponent,
  },
  {
    path: 'serie-a',
    component: CatalogueSerieAComponent,
  },
  {
    path: 'premierleague',
    component: CataloguePremierLeagueComponent,
  },
  {
    path: 'ligue1',
    component: CatalogueLigue1Component,
  },
  {
    path: 'laliga',
    component: CatalogueLaLigaComponent,
  },
  {
    path: 'bundesliga',
    component: CatalogueBundesligaComponent,
  },
  {
    path: 'retro',
    component: CatalogueRetroComponent,
  },
  {
    path: 'account',
    component: AccountComponent,
  },
  {
    path: 'success',
    component: PaymentSuccessComponent,
  },
  {
    path: 'cancel',
    component: PaymentCancelComponent,
  }
]
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    SingupComponent,
    NavbarComponent,
    BenefitSectionComponent,
    FooterComponent,
    TopSellersComponent,
    SerieAComponent,
    PremierLeagueComponent,
    Ligue1Component,
    BundesligaComponent,
    LaLigaComponent,
    TopChampionshipsComponent,
    CatalogueSerieAComponent,
    CataloguePremierLeagueComponent,
    CatalogueLigue1Component,
    CatalogueLaLigaComponent,
    CatalogueBundesligaComponent,
    CatalogueRetroComponent,
    CarouselComponent,
    AccountComponent,
    AddProductComponent,
    AllProductComponent,
    AllUserComponent,
    PaymentSuccessComponent,
    PaymentCancelComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    FormsModule,
  ],
  providers: [
    AuthService, {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
