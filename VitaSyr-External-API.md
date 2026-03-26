# VitaSyr - External Jobs API

## Base URL
```
https://vitaxirpro.com/external
```

## Authentication
كل الطلبات تحتاج هذا الـ header:
```
x-api-key: 8d57edc1234696d504eb9d24187bc5d311aedf70a53ec963e8823eff7e05ae3a
```

---

## Endpoints

### 1. جلب جميع الطلبات
```
GET /external/job-applications
```

**Query Parameters (اختيارية):**
| Parameter | Type | Description |
|---|---|---|
| `status` | string | فلتر بالحالة (PENDING, INTERVIEW_READY, ACCEPTED, REJECTED, HIRED, ALL) |
| `page` | number | رقم الصفحة (افتراضي: 1) |
| `limit` | number | عدد النتائج في الصفحة (افتراضي: 20) |

**مثال:**
```
GET /external/job-applications?status=PENDING&page=1&limit=10
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "fullName": "محمد أحمد",
      "email": "mohammad@example.com",
      "phone": "+963-11-123-4567",
      "specialization": "هندسة برمجيات",
      "yearsOfExperience": 5,
      "education": "بكالوريوس هندسة",
      "cvFileUrl": "/uploads/1234567890.pdf",
      "coverLetter": "...",
      "linkedinUrl": "https://linkedin.com/in/...",
      "ref1Name": "أحمد خالد",
      "ref1Company": "شركة ABC",
      "ref1JobTitle": "مدير تقني",
      "ref1Phone": "+963-11-111-1111",
      "ref2Name": "سامر علي",
      "ref2Company": "شركة XYZ",
      "ref2JobTitle": "مهندس أول",
      "ref2Phone": "+963-11-222-2222",
      "status": "PENDING",
      "reviewNotes": null,
      "rejectionNote": null,
      "rating": null,
      "createdAt": "2026-03-26T10:00:00.000Z",
      "updatedAt": "2026-03-26T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

---

### 2. جلب طلب واحد
```
GET /external/job-applications/:id
```

**مثال:**
```
GET /external/job-applications/abc123-uuid
```

**Response:** نفس شكل الـ object الواحد من المصفوفة أعلاه.

**إذا لم يوجد:**
```json
{ "message": "الطلب غير موجود" }  → 404
```

---

### 3. تحديث حالة الطلب
```
PUT /external/job-applications/:id
```

**Request Body:**
```json
{
  "status": "INTERVIEW_READY",
  "reviewNotes": "ملاحظات المراجع"
}
```

**الحالات المتاحة:**
| Status | المعنى |
|---|---|
| `PENDING` | معلق |
| `INTERVIEW_READY` | مؤهل للمقابلة |
| `ACCEPTED` | مقبول |
| `REJECTED` | مرفوض |
| `HIRED` | تم التوظيف |

**ملاحظات مهمة:**
- عند `REJECTED`: يجب إرسال `rejectionNote` (إجباري)
- عند `ACCEPTED`: يجب إرسال `rating` بقيمة بين 1-5 (إجباري)

**مثال قبول:**
```json
{
  "status": "ACCEPTED",
  "rating": 4,
  "reviewNotes": "مرشح ممتاز"
}
```

**مثال رفض:**
```json
{
  "status": "REJECTED",
  "rejectionNote": "لا يتوفر خبرة كافية في المجال المطلوب"
}
```

**Response:** الـ object المحدّث كاملاً.

---

### 4. إحصائيات الطلبات
```
GET /external/job-applications/stats
```

**Response:**
```json
{
  "total": 50,
  "pending": 20,
  "interviewReady": 10,
  "accepted": 8,
  "rejected": 7,
  "hired": 5
}
```

---

## رابط الـ CV
ملفات الـ CV متاحة على:
```
https://vitaxirpro.com{cvFileUrl}
```
مثال:
```
https://vitaxirpro.com/uploads/1234567890.pdf
```

---

## أكواد الخطأ
| Code | المعنى |
|---|---|
| `401` | API Key غير صحيح أو غير موجود |
| `400` | بيانات الطلب غير صحيحة |
| `404` | الطلب غير موجود |
| `500` | خطأ في السيرفر |
