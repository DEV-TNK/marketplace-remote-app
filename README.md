# UNLEASHIFIED BACKEND API

## Table of Contents

- [OVERVIEW](#overview)
- [Technologies Used](#technology-used)
<!-- - [Important Information](#Important-information) -->
- [Security Measures](#security-measures)
- [USER ENDPOINT](#user-endpoint)
- [ADMIN ENDPOINTS](#admin-endpoint)
- [JOB ENDPOINTS](#job-endpoints)
- [PROVIDER ENDPOINTS](#provider-endpoints)
- [PAYMENT ENDPOINTS](#payment-endpoints)
- [JOB SEEKER ENDPOINTS](#job-seeker-endpoints)
- [SETTING ENDPOINT](#setting-endpoint)
- [RATING ENDPOINT](#rating-endpoint)

### OVERVIEW

The UNLEASHIFIED BACKEND API is built with Node.js and Express.js, utilizing MongoDB and MySQL as the databases and Mongoose and Sequelize as the ORM. This API serves as the backend for the UNLEASHIFIED platform, providing registration, authentication, and job seeker and job provider functionalities.

### Technologies Used

- LANGUAGES : Node.js
- DATABASES : Mongodb, MySQL
- ORM : Mongoose, Sequelize
- FRAMEWORK : Express.js
- BASE_URL :

### Important Information

- Users must have a verified email to access the platform.
- Authentication involves access and refresh tokens.
- Dashboard endpoints require user authentication.

## Security Measures

<!-- - **Preventing Unauthorized PDF Downloads:**
Our platform includes security measures to prevent unauthorized downloading of PDF documents. This helps protect the content from being accessed by download managers like Internet Download Manager (IDM).

These security measures are in place to ensure that content is accessed and downloaded only by authorized users within the platform. We are committed to maintaining the security and integrity of our service to provide a safe and reliable environment for our users. -->

### ENDPOINTS

### POSTMAN DOCUMENTATION

To view the complete documentation visit
https://documenter.getpostman.com/view/27071267/2s9Ykn9h9K

### USER ENDPOINT

- REGISTRATION

  - This endpoint allows to create an account on the platform.
  - An email will be sent to the user before their account is created for verification
  - PATH: ../controllers/UserController/Authentication/Register

  ```

  ```

* VERIFY EMAIL

  - This endpoint makes the user to be Verified.
  - it will update the user verification status so as to allow the user login.
  - PATH: ../controllers/UserController/Authentication/verifyEmail

  ```

  ```

* RESEND EMAIL

  - if the user did not recieve mail in mail box, the user can hit this End point to resend the mail again
  - PATH: ../controllers/UserController/Authentication/resendEmail

  ```

  ```

* LOGIN USER

  - this endpoints grants user Access to the site if they meet the required conditions(verified email).
  - accesstoken and refreshtoken will be returned for Authorization purposes.
  - A cookie will be set in the browser
  - PATH: ../controllers/UserController/Authentication/login

  ```

  ```

* FORGOT PASSWORD

  - the user will have to input their email for Authentication. If their mail exists, an email will be sent to their mailbox
  - PATH: ../controllers/UserController/Authentication/forgotPassword

  ```

  ```

* RESET PASSWORD

  - This endpoint updates the user password.
  - PARAM: `token`
  - PATH: ../controllers/UserController/Authentication/resetPassword

  ```


  ```

* LOGOUT USER

  - This endpoint allow the user to logout of there account
  - Get user id from cookie sent during authorization for login
  - PATH: ../controllers/UserController/Authentication/logout

  ```


  ```

* GET A USER

  - This endpoint get save users interest
  - PATH: ../controllers/UserController/Authentication/userInterest

  ```

  ```

### JOB ENDPOINTS

- CREATE JOB ENDPOINT

  - This endpoint is to create a job post.
  - PATH: ../controllers/JobController/job/createJob

  ```

  ```

* GET ALL JOB POST

  - This endpoint is to get all job post.
  - Sort with time it was created
  - PATH: ../controllers/JobController/job/getAllJobs

  ```

  ```

* GET LANDING PAGE JOBS

  - This endpoint is to get jobs on the landing page
  - PATH: ../controllers/JobController/job/getLandingPageJobs

  ```

  ```

* GET ALL JOBS CATEGORY

  - This endpoint is to get all job categories
  - PATH: ../controllers/JobController/job/allJobsCategory

  ```

  ```

* GET ALL JOBS

  - This endpoint is to get the total of jobs posting
  - PATH: ../controllers/JobController/job/allJobs

  ```

  ```

* GET A JOB

  - This endpoint is to get a job post
  - PATH: ../controllers/JobController/job/getAJob

  ```

  ```

* GET JOBS CREATED PER MONTH

  - This endpoint is to get jobs created per month
  - PATH: ../controllers/JobController/job/getJobCreatedPerMonth

  ```

  ```

* GET JOB CREATED BY PROVIDER PER MONTH

  - This endpoint is to get the jobs created by a provider per month
  - PATH: ../controllers/JobController/job/getJobCreatedByProviderPerMonth

  ```

  ```

* GET TOTAL AND NEW JOBS

  - This endpoint is to get the total and new jobs posted by the provider
  - PATH: ../controllers/JobController/job/totalJobsAndNewestJob

  ```

  ```

### ADMIN ENDPOINTS

- GET ADMIN OVERVIEW

  - This endpoint allow admin to get the overview of the dashboard data.
  - PATH: ../controllers/AdminController/Overview/overview

  ```

  ```

* GET ADMIN OVERVIEW OF LAST FOUR JOBS

  - This endpoint allow admin to get the last four jobs posted.
  - PATH: ../controllers/AdminController/Overview/last4JobsCreated

  ```

  ```

* GET ADMIN OVERVIEW MOST POPULAR

  - This endpoint allow admin to get most popular job provider
  - PATH: ../controllers/AdminController/Overview/mostPopular

  ```

  ```

* GET ADMIN JOB CATEGORY

  - This endpoint allows admin to get job categories
  - PATH: ../controllers/AdminController/Overview/jobCategory

  ```

  ```

* GET ADMIN CATEGORY SINGLE

  - This endpoint allows the admin to get a single job category
  - PATH: ../controllers/AdminController/Overview/categorySingle

  ```

  ```

* GET ADMIN OVERVIEW TOTAL JOBS BY DEPARTMENT

  - This endpoint allow admin to get an overview of total jobs posted by department
  - PATH: ../controllers/AdminController/Overview/totalJobsByDepartment

  ```

  ```

* GET ADMIN OVERVIEW FOR JOB STATUS

  - This endpoint allow admin to get an overview of job status
  - PATH: ../controllers/AdminController/Overview/jobStatus

  ```

  ```

* GET ADMIN JOB POSTERS

  - This endpoint allows admin to get all job posters
  - PATH: ../controllers/AdminController/Overview/getAllJobPoster

  ```

  ```

* GET JOB SEEKERS

  - This endpoint allows admin to get all job seekers information
  - PATH: ../controllers/AdminController/Overview/getAllJobSeekersInfo

  ```

  ```

* GET ADMIN ONGOING JOBS

  - This endpoint allows admin to get all ongoing jobs
  - PATH: ../controllers/AdminController/Overview/OngoingJobs

  ```

  ```

* GET ADMIN COMPLETED JOBS

  - This endpoint allows the admin to get all completed jobs
  - PATH: ../controllers/AdminController/Overview/CompletedJobs

  ```

  ```

* GET ADMIN ALL JOB

- This endpoint allows the admin to get all jobs posted
- PATH: ../controllers/AdminController/Job/adminAllJobs

```

```

- ADMIN GET ALL PENDING PAYMENT

* This endpoint is to get all the seeker pending payments by the admin
* ../controllers/AdminController/Payment/seekerPendingPayment

```

```

- ADMIN ACCEPT OR REJECT PAYMENTS

  - This endpoint is for the admin to accept or reject payment
  - PATH: ../controllers/AdminController/Payment/acceptOrRejectPayment

  ```

  ```

- MARK WITHDRAWAL REQUEST
  - This endpoint is for the admin to mark a payment request
  - PATH: ../controllers/AdminController/Payment/markWithdrawalRequest

```

```

### PROVIDER ENDPOINTS

- CREATE PROVIDER

  - This endpoint is to create a job provider and save in the database
  - PATH: ../controllers/ProviderController/CreateProvider/createProvider

  ```

  ```

* GET COMPANY ABOUT US

  - This endpoint is to get the about us page of a company
  - PATH: ../controllers/ProviderController/CreateProvider/getCompanyAboutUs

  ```

  ```

* GET ALL JOBS POSTED BY A COMPANY

  - This endpoint is to get all jobs posted by a company
  - PATH: ../controllers/ProviderController/CreateProvider/getAllJobsPostedByCompany

  ```

  ```

* GET COMPANY DETAILS

  - This endpoint is to get a companies details
  - PATH: ../controllers/ProviderController/CreateProvider/companyDetails

  ```

  ```

* SEARCH COMPANY LIST

  - This endpoint is to search for a company's list
  - PATH: ../controllers/ProviderController/CreateProvider/searchCompanyList

  ```

  ```

* GET A SINGLE COMPANY

  - This endpoint is to get a single company
  - PATH: ../controllers/ProviderController/CreateProvider/companySingle

  ```

  ```

* MARK COMPLETED JOBS

  - This endpoint is to for mark completed jobs
  - PATH: ../controllers/ProviderController/MyJobs/makeJobCompleted

  ```

  ```

* GET MY JOBS

  - This endpoint is to get users ongoing and completed jobs
  - PATH: ../controllers/ProviderController/MyJobs/getMyJobs

  ```

  ```

* SEND OFFER

  - This endpoint is for a provider to send offer to a job seeker
  - PATH: ../controllers/ProviderController/ApplicantsProfile/sendOffer

  ```

  ```

* GET MY JOB APPLICATION

  - This endpoint allows the job provider get all applicants
  - PATH: ../controllers/ProviderController/ApplicantsProfile/myJobApplication

  ```

  ```

* UPLOAD PROVIDER IMAGE

  - This endpoint is to upload a job poster image
  - PATH: ../controllers/ProviderController/dashboard/uploadProviderImage

  ```

  ```

* GET MY DASHBOARD

  - This endpoint is to get provider dashboard data
  - PATH:../controllers/ProviderController/dashboard/getMydashboard

  ```

  ```

* GET LAST FOUR PAID JOBS

  - This endpoint is to get the last four paid jobs
  - PATH: ../controllers/ProviderController/dashboard/getlastFourPaidJobs

  ```

  ```

* GET TOTAL JOBS AND NEWEST JOB

  - This endpoint is to get total jobs and newest job
  - PATH: ../controllers/JobController/job/totalJobsAndNewestJob

  ```

  ```

* SEARCH JOB LIST

  - This endpoint allow users to search for job list
  - PATH: ../controllers/JobController/job/searchJobList

  ```

  ```

* GET TOP COMPANY HIRING

  - This endpoint is to get top companies hiring
  - PATH: ../controllers/ProviderController/TopCompanies

  ```

  ```

* MARK JOB COMPLETED
  - This endpoint allows the job provider to mark jobs as completed
    -PATH: ../controllers/ProviderController/MyJobs/makeJobCompleted

### PAYMENT ENDPOINTS

- PROVIDER JOB PAYMENT

  - This endpoint is allows a job provider to be able to make payment
  - PATH: ../controllers/PaymentController/Payment/providerJobPayment

  ```

  ```

* GET ALL PROVIDER TRANSACTION

  - This endpoint is to get all the transactions performed by the job provider
  - PATH: ../controllers/PaymentController/Payment/allProviderTransaction

```

```

- GET ALL PAYMENT
  - This endpoint is to get all payments
  - PATH: ../controllers/PaymentController/Payment/getAllPayment

```

```

- PAYMENT REQUEST
  - This endpoint is to create a payment request
  - PATH: ../controllers/PaymentController/Payment/paymentRequest

```

```

- GET ALL SEEKER WITHDRAWAL REQUEST

  - This endpoint is to get all seekers withdrawal request
  - PATH: ../controllers/PaymentController/Payment/allSeekerWithdrawalRequest

  ```

  ```

* SAVE ACCOUNT DETAILS

  - This endpoint is to save a user account information
  - PATH: ../controllers/PaymentController/AccountController/saveJobSeekerAccount

  ```

  ```

* GET USER ACCOUNT DETAILS

  - This endpoint is to get users bank details saved in the database
  - PATH: ../controllers/PaymentController/AccountController/getUserBankDetails

  ```

  ```

* SAVE PAYMENT RECORDS

  - This endpoint is to save payment records
  - PATH: ../controllers/PaymentController/PaymentRecordController/savePaymentRecords

  ```

  ```

* GET PAYMENT RECORDS

  - This endpoint is to get the payment records of a user
  - PATH: ../controllers/PaymentController/PaymentRecordController/getPaymentRecords

  ```

  ```

### JOB SEEKER ENDPOINTS

- UPDATE OR CREATE SEEKER RESUME

  - This endpoint allows a job seeker to update or create their resume
  - PATH: ../controllers/SeekerController/SeekerResume/updateOrCreateSeekerResume

  ```

  ```

* GET USER RESUME JOB DETAILS

  - This endpoint is to get job seekers resume details
  - PATH: ../controllers/SeekerController/SeekerResume/getUserResumeDetails

  ```

  ```

* GET A RESUME

  - This endpoint is to get a resume
  - PATH: ../controllers/SeekerController/SeekerResume/getAResume

  ```

  ```

* GET MY RESUME

  - This endpoint is to get my resume
  - PATH:../controllers/SeekerController/SeekerResume/getMyResume

  ```

  ```

* JOB APPLICATION

  - This endpoint allows a job seeker apply for a job
  - PATH: ../controllers/SeekerController/JobApplication/jobApplication

  ```

  ```

* GET TOTAL JOBS APPLIED

  - This endpoint get the total number of jobs a job seeker has applied for
  - PATH: ../controllers/SeekerController/JobApplication/totalJobsApplied

  ```

  ```

* GET MY OFFER LETTER

  - This endpoint for a job seeker to get their offer letter
  - PATH: ../controllers/SeekerController/JobApplication/myOfferLetter

  ```

  ```

* ACCEPT OR REJECT OFFER

  - This endpoint allows a job seeker to either accept or reject an offer
  - PATH: ../controllers/SeekerController/JobApplication/acceptOrRejectOffer

  ```

  ```

* GET JOB SEEKER DASHBOARD DATA

  - This endpoint is to get the data for the job seeker dashboard
  - PATH: ../controllers/SeekerController/seekerDashboard/getJobSeekerDashboardData

  ```

  ```

* GET LAST JOBS APPROVED

  - This endpoint is to get the last jobs approved
  - PATH: ../controllers/SeekerController/seekerDashboard/getLastApprovedJobs

  ```

  ```

* UPLOAD SEEKER IMAGE

  - This endpoint allow a seeker to upload their
  - PATH: ../controllers/SeekerController/seekerDashboard/imageuploadSeekerImage

  ```

  ```

* GET RECOMMENDATION

  - This endpooint is to get recmmendations on the landing page
  - PATH: ../controllers/SeekerController/SeekerLanding/getRecommendation

  ```

  ```

* CREATE SERVICE

  - This endpoint is to create service
  - PATH: ../controllers/SeekerController/Service/createService

  ```

  ```

* GET MY SERVICES

  - This endpoint is to get my services
  - PATH: ../controllers/SeekerController/Service/getMyServices

  ```

  ```

* GET A SERVICE

  - This endpoint is to get a service
  - PATH: ../controllers/SeekerController/Service/getAService

  ```

  ```

* GET ALL SERVICES
  - This endpoint is to get all services
  - PATH: ../controllers/SeekerController/Service/getAllServices

```

```

- SEARCH FOR SERVICES

  - This endpoint is to search for services
  - PATH: ../controllers/SeekerController/Service/servicesSearch

  ```

  ```

* GET MY JOBS
  - This endpoint is to get a job seeeker jobs
  - PATH: ../controllers/SeekerController/myJobs/getMyJobs

```

```

- GET CONTRACT

  - This endpoint allows the seeker to get their job contracts
  - PATH: ../controllers/SeekerController/Contract/myContract

  ```

  ```

* EDIT SEEKER SERVICE

  - This endpoint allows the job seeker to edit their services
  - PATH: ../controllers/SeekerController/Service/editSeekerServices

  ```

  ```

- DELETE SEEKER SERVICE

  - This endpoint allows the job seeker to delete their services
  - PATH: ../controllers/SeekerController/Service/deleteSeekerService

  ```

  ```

- GET SEEKER EARNING

  - This endpoint allows the job seeker to get their earnings
  - PATH: ../controllers/SeekerController/Earning/getSeekerEarning

  ```

  ```

- GET ALL JOB SEEKER PAYMENT REQUEST

  - This endpoint allows the job seeker to get their withdrawal history
  - PATH: ../controllers/SeekerController/Earning/getAllSeekerPaymentRequest

  ```

  ```

- GET JOB SEEKER ONGOING JOBS

  - This endpoint allows the job seeker to get their ongoing jobs
  - PATH: ../controllers/SeekerController/myJobs/getJobSeekerOngoingJobs

  ```

  ```

- GET JOB SEEKER COMPLETED JOBS
  - This endpoint allows the job seeker to get their completed jobs
  - PATH: ../controllers/SeekerController/myJobs/getJobSeekerCompletedJobs

```

```

- GET APPLICATIONS BY SEEKER

  - This endpoint is to get the monthly and total applications by a seeker
  - PATH: ../controllers/SeekerController/JobApplication/getApplicationsBySeeker

  ```

  ```

### SETTING ENDPOINT

- SOCIAL PROFILE
  - This endpoint is to add or update social profile
  - PATH: ../controllers/SettingController/SocialProfile/socialProfile

```

```

- GET SOCIAL PROFILE
  - This endpoint is to get social profile
  - PATH: ../controllers/SettingController/SocialProfile/getSocial

```

```

- DELETE ACCOUNT
  - This endpoint is to delete a user account
  - PATH: ../controllers/SettingController/DeleteAccount

```

```

### RATING ENDPOINT

- SUBMIT REVIEWS

  - This endpoint allows users to submit ratings and reviews
  - PATH: ../controllers/JobController/RatingController/submitReview

  ```

  ```

* GET ALL REVIEWS

  - This endpoint is to get all reviews
  - PATH: ../controllers/JobController/RatingController/getAllReviews

  ```

  ```

* GET REVIEWS BY PROVIDER

  - This endpoint is to get reviews by job providers
  - PATH: ../controllers/JobController/RatingController/getReviewsByProvider

  ```

  ```

* GET REVIEWS BY SEEKER

  - This endpoint is to get reviews by job seekers
  - PATH: ../controllers/JobController/RatingController/getReviewsBySeeker

  ```

  ```

### CUSTOMER CARE ENDPOINT

- USER CONTACT US

  - This endpoint is for users to be able to contact customer service
  - PATH: ../controllers/CustomerCareController/contactUs/userContactUs

  ```

  ```

* GET ALL CONTACT

  - This endpoint is to get all messages sent to the customer care
  - PATH: ../controllers/CustomerCareController/contactUs/allContactUs

  ```

  ```

* CONTACT US COMPLETED

- This endpoint is to response to the user that their query has been completed
- PATH: ../controllers/CustomerCareController/contactUs/contactUsCompleted

  ```

  ```

### CONFLICT RESOLUTION ENDPOINT

- CREATE CONFLICT RESOLUTION

  - This endpoint is to create a conflict resolution
  - PATH: ../controllers/ConflictResolutionController/conflictResolution/ conflictResolution

  ```

  ```

- GET CONFLICT RESOLUTION

  - This endpoint is to get confliction resolutions
  - ../controllers/ConflictResolutionController/conflictResolution/getConflictResolution

  ```

  ```

- COMPLETED CONFLICT

  - This endpoint is for compeleted conflict
  - ../controllers/ConflictResolutionController/conflictResolution/completedConflict

  ```

  ```

- GET MY CONFLICT RESOLUTION

  - This endpoint is for the user to get their conflict resolution
  - ../controllers/ConflictResolutionController/conflictResolution/getMyConflictResolution

  ```

  ```
### ACTIVITIES ENDPOINT
* USER ACTIVITIES
  - This is used to create user activities
  - PATH: ../controllers/ActivitiesController/UserActivities/userActivities
  

