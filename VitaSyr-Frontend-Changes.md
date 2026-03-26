# تعديلات Frontend - طلبات التوظيف

---

## 1. تحديث Types
**الملف:** `src/types/jobApplication.ts`

```typescript
export interface JobApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  specialization: string;
  yearsOfExperience: number;
  education: string;
  cvFileUrl: string;
  coverLetter?: string | null;
  linkedinUrl?: string | null;

  // المراجع (جديد)
  ref1Name: string;
  ref1Company: string;
  ref1JobTitle: string;
  ref1Phone: string;
  ref2Name: string;
  ref2Company: string;
  ref2JobTitle: string;
  ref2Phone: string;

  status: JobApplicationStatus;
  reviewedById?: string | null;
  reviewNotes?: string | null;
  rejectionNote?: string | null;  // جديد
  rating?: number | null;         // جديد (1-5)
  createdAt: string;
  updatedAt: string;
}

// تغيّر: حُذف REVIEWED، أضيف INTERVIEW_READY و HIRED
export type JobApplicationStatus =
  | "PENDING"
  | "INTERVIEW_READY"
  | "ACCEPTED"
  | "REJECTED"
  | "HIRED";

export interface CreateJobApplicationDto {
  fullName: string;
  email: string;
  phone: string;
  specialization: string;
  yearsOfExperience: number;
  education: string;
  coverLetter?: string;
  linkedinUrl?: string;
  // المراجع (جديد - إجباري)
  ref1Name: string;
  ref1Company: string;
  ref1JobTitle: string;
  ref1Phone: string;
  ref2Name: string;
  ref2Company: string;
  ref2JobTitle: string;
  ref2Phone: string;
}

export interface UpdateJobApplicationDto {
  status?: JobApplicationStatus;
  reviewNotes?: string;
  rejectionNote?: string;  // جديد
  rating?: number;         // جديد
  reviewedById?: string;
}
```

---

## 2. تحديث API Client
**الملف:** `src/lib/api/jobs.ts`

في دالة `createWithCV`، أضف حقول المراجع في `FormData` بعد `linkedinUrl`:

```typescript
formData.append("ref1Name", applicationData.ref1Name);
formData.append("ref1Company", applicationData.ref1Company);
formData.append("ref1JobTitle", applicationData.ref1JobTitle);
formData.append("ref1Phone", applicationData.ref1Phone);
formData.append("ref2Name", applicationData.ref2Name);
formData.append("ref2Company", applicationData.ref2Company);
formData.append("ref2JobTitle", applicationData.ref2JobTitle);
formData.append("ref2Phone", applicationData.ref2Phone);
```

---

## 3. تعديل فورم "انضم إلينا"
**الملف:** `src/app/(public)/join-us/page.tsx`

### أ. إضافة import
```typescript
import { ..., Users } from "lucide-react";
```

### ب. إضافة state variables
```typescript
const [ref1Name, setRef1Name] = useState("");
const [ref1Company, setRef1Company] = useState("");
const [ref1JobTitle, setRef1JobTitle] = useState("");
const [ref1Phone, setRef1Phone] = useState("");

const [ref2Name, setRef2Name] = useState("");
const [ref2Company, setRef2Company] = useState("");
const [ref2JobTitle, setRef2JobTitle] = useState("");
const [ref2Phone, setRef2Phone] = useState("");
```

### ج. إضافة validation في handleSubmit
```typescript
if (!ref1Name || !ref1Company || !ref1JobTitle || !ref1Phone ||
    !ref2Name || !ref2Company || !ref2JobTitle || !ref2Phone) {
  toast.error("الرجاء ملء جميع حقول المراجع");
  return;
}
```

### د. تعديل createWithCV call - إضافة الحقول الجديدة
```typescript
await jobsApi.createWithCV(
  {
    // ... الحقول الموجودة
    ref1Name: ref1Name.trim(),
    ref1Company: ref1Company.trim(),
    ref1JobTitle: ref1JobTitle.trim(),
    ref1Phone: ref1Phone.trim(),
    ref2Name: ref2Name.trim(),
    ref2Company: ref2Company.trim(),
    ref2JobTitle: ref2JobTitle.trim(),
    ref2Phone: ref2Phone.trim(),
  },
  cvFile
);
```

### ه. إضافة reset بعد النجاح
```typescript
setRef1Name(""); setRef1Company(""); setRef1JobTitle(""); setRef1Phone("");
setRef2Name(""); setRef2Company(""); setRef2JobTitle(""); setRef2Phone("");
```

### و. إضافة قسم المراجع في الفورم (بعد LinkedIn وقبل زر الإرسال)
```tsx
<div className="border-t-2 border-gray-200 pt-6 mt-6">
  <div className="flex items-center gap-3 mb-6">
    <div className="p-2 bg-primary-100 rounded-lg">
      <Users className="w-5 h-5 text-primary-500" />
    </div>
    <h3 className="text-xl font-bold text-gray-900">المراجع</h3>
  </div>

  {/* المرجع الأول */}
  <div className="mb-6">
    <h4 className="text-lg font-semibold text-gray-800 mb-4">
      المرجع الأول <span className="text-red-500">*</span>
    </h4>
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <label className="block text-gray-700 font-bold mb-2">اسم الشخص المرجعي</label>
        <input type="text" value={ref1Name} onChange={(e) => setRef1Name(e.target.value)} required
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-colors"
          placeholder="الاسم الكامل" />
      </div>
      <div>
        <label className="block text-gray-700 font-bold mb-2">اسم الشركة</label>
        <input type="text" value={ref1Company} onChange={(e) => setRef1Company(e.target.value)} required
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-colors"
          placeholder="اسم الشركة التي يعمل بها" />
      </div>
      <div>
        <label className="block text-gray-700 font-bold mb-2">المسمى الوظيفي</label>
        <input type="text" value={ref1JobTitle} onChange={(e) => setRef1JobTitle(e.target.value)} required
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-colors"
          placeholder="مسماه الوظيفي" />
      </div>
      <div>
        <label className="block text-gray-700 font-bold mb-2">رقم التواصل</label>
        <input type="tel" value={ref1Phone} onChange={(e) => setRef1Phone(e.target.value)} required
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-colors"
          placeholder="+963-XX-XXX-XXXX" />
      </div>
    </div>
  </div>

  {/* المرجع الثاني */}
  <div>
    <h4 className="text-lg font-semibold text-gray-800 mb-4">
      المرجع الثاني <span className="text-red-500">*</span>
    </h4>
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <label className="block text-gray-700 font-bold mb-2">اسم الشخص المرجعي</label>
        <input type="text" value={ref2Name} onChange={(e) => setRef2Name(e.target.value)} required
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-colors"
          placeholder="الاسم الكامل" />
      </div>
      <div>
        <label className="block text-gray-700 font-bold mb-2">اسم الشركة</label>
        <input type="text" value={ref2Company} onChange={(e) => setRef2Company(e.target.value)} required
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-colors"
          placeholder="اسم الشركة التي يعمل بها" />
      </div>
      <div>
        <label className="block text-gray-700 font-bold mb-2">المسمى الوظيفي</label>
        <input type="text" value={ref2JobTitle} onChange={(e) => setRef2JobTitle(e.target.value)} required
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-colors"
          placeholder="مسماه الوظيفي" />
      </div>
      <div>
        <label className="block text-gray-700 font-bold mb-2">رقم التواصل</label>
        <input type="tel" value={ref2Phone} onChange={(e) => setRef2Phone(e.target.value)} required
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-2 focus:ring-accent-200 transition-colors"
          placeholder="+963-XX-XXX-XXXX" />
      </div>
    </div>
  </div>
</div>
```

---

## 4. تحديث صفحة قائمة الطلبات (Dashboard)
**الملف:** `src/app/(dashboard)/dashboard/jobs/page.tsx`

### تحديث getStatusLabel و getStatusColor:
```typescript
const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    PENDING: "معلق",
    INTERVIEW_READY: "مؤهل للمقابلة",  // جديد
    ACCEPTED: "مقبول",
    REJECTED: "مرفوض",
    HIRED: "تم التوظيف",               // جديد
  };
  return labels[status] || status;
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    INTERVIEW_READY: "bg-blue-100 text-blue-800",   // جديد
    ACCEPTED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
    HIRED: "bg-purple-100 text-purple-800",         // جديد
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};
```

### تحديث أزرار الفلترة - احذف REVIEWED، أضف INTERVIEW_READY و HIRED:
```tsx
<Button variant={filterStatus === "INTERVIEW_READY" ? "primary" : "outline"} size="sm"
  onClick={() => setFilterStatus("INTERVIEW_READY")}>
  مؤهل للمقابلة ({applications.filter((a) => a.status === "INTERVIEW_READY").length})
</Button>
<Button variant={filterStatus === "HIRED" ? "primary" : "outline"} size="sm"
  onClick={() => setFilterStatus("HIRED")}>
  تم التوظيف ({applications.filter((a) => a.status === "HIRED").length})
</Button>
```

---

## 5. تحديث صفحة تفاصيل الطلب (Dashboard)
**الملف:** `src/app/(dashboard)/dashboard/jobs/[id]/page.tsx`

### أ. إضافة import
```typescript
import { ..., Users } from "lucide-react";
```

### ب. تحديث خيارات الحالة في select:
```tsx
<select value={status} onChange={(e) => setStatus(e.target.value as JobApplicationStatus)} ...>
  <option value="PENDING">معلق</option>
  <option value="INTERVIEW_READY">مؤهل للمقابلة</option>
  <option value="ACCEPTED">مقبول</option>
  <option value="REJECTED">مرفوض</option>
  <option value="HIRED">تم التوظيف</option>
</select>
```

### ج. إضافة قسم المراجع (بعد قسم المعلومات المهنية):
```tsx
<div className="bg-white rounded-lg border border-gray-200 p-6">
  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
    <Users className="w-5 h-5" />
    المراجع
  </h2>
  <div className="space-y-6">
    <div>
      <h3 className="font-medium text-gray-800 mb-2">المرجع الأول</h3>
      <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-lg">
        <div><label className="text-sm text-gray-500">الاسم</label><p>{application.ref1Name}</p></div>
        <div><label className="text-sm text-gray-500">الشركة</label><p>{application.ref1Company}</p></div>
        <div><label className="text-sm text-gray-500">المسمى الوظيفي</label><p>{application.ref1JobTitle}</p></div>
        <div><label className="text-sm text-gray-500">رقم التواصل</label><p dir="ltr">{application.ref1Phone}</p></div>
      </div>
    </div>
    <div>
      <h3 className="font-medium text-gray-800 mb-2">المرجع الثاني</h3>
      <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-lg">
        <div><label className="text-sm text-gray-500">الاسم</label><p>{application.ref2Name}</p></div>
        <div><label className="text-sm text-gray-500">الشركة</label><p>{application.ref2Company}</p></div>
        <div><label className="text-sm text-gray-500">المسمى الوظيفي</label><p>{application.ref2JobTitle}</p></div>
        <div><label className="text-sm text-gray-500">رقم التواصل</label><p dir="ltr">{application.ref2Phone}</p></div>
      </div>
    </div>
  </div>
</div>
```

### د. إضافة حقل rejectionNote (يظهر عند الرفض):
```tsx
{status === "REJECTED" && (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      ملاحظة الرفض <span className="text-red-500">*</span>
    </label>
    <textarea
      value={rejectionNote}
      onChange={(e) => setRejectionNote(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
      rows={3}
      placeholder="سبب الرفض..."
    />
  </div>
)}
```

### ه. إضافة حقل rating (يظهر عند القبول):
```tsx
{status === "ACCEPTED" && (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      درجة التقييم (1-5) <span className="text-red-500">*</span>
    </label>
    <select value={rating} onChange={(e) => setRating(Number(e.target.value))}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg">
      <option value="">اختر درجة</option>
      {[1, 2, 3, 4, 5].map(n => (
        <option key={n} value={n}>{n}</option>
      ))}
    </select>
  </div>
)}
```

### و. تحديث دالة handleUpdate - إضافة الحقول الجديدة:
```typescript
const updateData: UpdateJobApplicationDto = { status, reviewNotes };
if (status === "REJECTED") updateData.rejectionNote = rejectionNote;
if (status === "ACCEPTED") updateData.rating = rating;
```
