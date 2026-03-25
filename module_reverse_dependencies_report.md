# Reverse Module Dependencies Report

This document outlines which modules are using each specific module (its dependents) in the `apps/dms/src` directory.

| Module File | Module Name | Used By (Dependents) |
|---|---|---|
| `academic.module.ts` | `AcademicModule` | `AppModule` |
| `activity.module.ts` | `ActivityModule` | `AcademicModule` |
| `ai.module.ts` | `AiModule` | `CourseGenerateModule`, `CourseScheduleModule` |
| `app.module.ts` | `AppModule` | *(None)* |
| `attendance.module.ts` | `AttendanceModule` | `CoreAttendanceModule` |
| `auth0.module.ts` | `Auth0Module` | *(None)* |
| `auth.module.ts` | `AuthModule` | `CoreModule` |
| `bkash.module.ts` | `BkashModule` | `ProvidersModule` |
| `External/Third-Party` | `BullModule` | `AppModule`, `CourseGenerateModule` |
| `cache.module.ts` | `CacheModule` | `CoreModule`, `DatabaseModule` |
| `chat.module.ts` | `ChatModule` | `GatewayModule`, `MessengerModule` |
| `config.module.ts` | `ConfigModule` | `CoreModule`, `DatabaseModule` |
| `conversation.module.ts` | `ConversationModule` | `ChatModule`, `GatewayModule` |
| `core-attendance.module.ts` | `CoreAttendanceModule` | `AppModule` |
| `core.module.ts` | `CoreModule` | `AppModule` |
| `course-generate.module.ts` | `CourseGenerateModule` | `AcademicModule` |
| `course.module.ts` | `CourseModule` | `AiModule`, `AcademicModule`, `CourseScheduleModule` |
| `course_schedule.module.ts` | `CourseScheduleModule` | `AcademicModule`, `AttendanceModule` |
| `database.module.ts` | `DatabaseModule` | `CoreModule` |
| `fee.module.ts` | `FeeModule` | `FinanceModule`, `PaymentApiModule` |
| `finance.module.ts` | `FinanceModule` | `AppModule` |
| `gateway.module.ts` | `GatewayModule` | `MessengerModule` |
| `identity.module.ts` | `IdentityModule` | `AppModule` |
| `message.module.ts` | `MessageModule` | `ChatModule`, `ConversationModule` |
| `messenger.module.ts` | `MessengerModule` | `AppModule` |
| `External/Third-Party` | `NestConfigModule` | `ConfigModule` |
| `notice.module.ts` | `NoticeModule` | `AcademicModule`, `ActivityModule` |
| `participants.module.ts` | `ParticipantsModule` | `ChatModule`, `ConversationModule` |
| `External/Third-Party` | `PassportModule` | `AuthModule` |
| `payment-api.module.ts` | `PaymentApiModule` | `FinanceModule` |
| `payment.module.ts` | `PaymentModule` | `PaymentApiModule` |
| `External/Third-Party` | `PrometheusModule` | `AppModule` |
| `providers.module.ts` | `ProvidersModule` | `PaymentModule` |
| `report.module.ts` | `ReportModule` | `ReportingModule` |
| `reporting.module.ts` | `ReportingModule` | `AppModule` |
| `room.module.ts` | `RoomModule` | `AiModule`, `SeederModule`, `AcademicModule` |
| `seeder.module.ts` | `SeederModule` | `CoreModule` |
| `semester.module.ts` | `SemesterModule` | `AcademicModule`, `CourseModule`, `StudentModule` |
| `External/Third-Party` | `SentryModule` | `AppModule` |
| `External/Third-Party` | `ServeStaticModule` | `AppModule` |
| `sslcomerz.module.ts` | `SslcomerzModule` | `ProvidersModule` |
| `stripe.module.ts` | `StripeModule` | `ProvidersModule` |
| `student.module.ts` | `StudentModule` | `AuthModule`, `AttendanceModule`, `PaymentApiModule`, `IdentityModule` |
| `teacher-attendance.module.ts` | `TeacherAttendanceModule` | `CoreAttendanceModule` |
| `teacher.module.ts` | `TeacherModule` | `AiModule`, `AuthModule`, `SeederModule`, `TeacherUnavailabilityModule`, `IdentityModule` |
| `teacher_unavailability.module.ts` | `TeacherUnavailabilityModule` | `AiModule`, `CoreAttendanceModule` |
| `External/Third-Party` | `TypeOrmModule` | `DatabaseModule`, `SeederModule`, `ActivityModule`, `CourseGenerateModule`, `CourseModule`, `CourseScheduleModule`, `NoticeModule`, `RoomModule`, `SemesterModule`, `AttendanceModule`, `TeacherAttendanceModule`, `TeacherUnavailabilityModule`, `FeeModule`, `PaymentApiModule`, `StudentModule`, `TeacherModule`, `UserModule`, `ConversationModule`, `MessageModule`, `ParticipantsModule`, `ReportModule` |
| `user.module.ts` | `UserModule` | `AuthModule`, `SeederModule`, `ActivityModule`, `CourseModule`, `PaymentApiModule`, `IdentityModule`, `StudentModule`, `TeacherModule`, `GatewayModule` |
