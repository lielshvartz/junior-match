# Junior Match 🚀

Junior Match היא פלטפורמה מודרנית המיועדת לחבר בין בוגרי קורסים ואוניברסיטאות (ג'וניורים) לבין מעסיקים וחברות הייטק המחפשות כישרונות צעירים. הפרויקט נבנה כחלק מפרויקט הגמר בקורס פיתוח Full-Stack.

## 🔗 קישורים לפרויקט
* **אתר באוויר (Live Demo):** [https://junior-match.vercel.app](https://junior-match.vercel.app)
* **מאגר קוד (GitHub):** [https://github.com/lielshvartz/junior-match](https://github.com/lielshvartz/junior-match)

---

## 🎯 הגדרת המוצר והערך

### הבעיה
שוק העבודה לג'וניורים בתחום הפיתוח והטכנולוגיה קשוח במיוחד. משרות רבות דורשות "ניסיון קודם", ופלטפורמות קיימות מוצפות במועמדים בעלי ניסיון רב, מה שמשאיר את בוגרי הלימודים הטריים ללא מענה רלוונטי ובחוסר אונים מול סינון קורות חיים אוטומטי.

### קהל היעד
1. **ג'וניורים ובוגרי לימודים:** מחפשי עבודה בתחילת דרכם המקצועית בתעשייה המעוניינים להציג את היכולות שלהם.
2. **מעסיקים ומגייסים (HR):** חברות ומנהלים טכנולוגיים שרוצים לגייס כישרונות רעננים ללא צורך לסנן אלפי פרופילים לא רלוונטיים.

### הבידול והערך
Junior Match מתמקדת **אך ורק** במשרות ג'וניור ומותאמת אישית לצרכים שלהם. הפלטפורמה מאפשרת הצגה של פרויקטים מעשיים (ולא רק קורות חיים יבשים) ומאפשרת למעסיקים לסנן מועמדים על פי כישורים אמיתיים, התאמה טכנולוגית ומוטיבציה, ולא על סמך שנות ניסיון.

---

## 🛠️ שירותים חיצוניים ואינטגרציות

| שירות | סוג | למה משמש |
| :--- | :--- | :--- |
| **Supabase Auth** | אוטנטיקציה | ניהול משתמשים, הרשמה והתחברות מאובטחת (לתפקידי ג'וניור ומעסיק) |
| **Supabase DB** | בסיס נתונים | שמירת המשרות, פרופילי המשתמשים והגשות המועמדות בזמן אמת (PostgreSQL) |
| **Vercel** | דיפלוימנט | מארח ה-Frontend הרשמי עם תהליך פריסה אוטומטי (CI/CD) בכל Push לענף הראשי |

---

## 📊 מודל הנתונים (ERD)

הפרויקט משתמש בבסיס נתונים יחסי המנוהל ב-Supabase. להלן מבנה הטבלאות והקשרים ביניהן:

```mermaid
erDiagram
    USERS {
        uuid id PK
        string email
        string role "junior / employer"
        timestamp created_at
    }
    PROFILES {
        uuid id PK, FK
        string full_name
        string title
        string resume_url
        string github_url
    }
    JOBS {
        uuid id PK
        uuid employer_id FK
        string title
        string company
        string description
        string location
        timestamp created_at
    }
    APPLICATIONS {
        uuid id PK
        uuid job_id FK
        uuid junior_id FK
        string status "pending / reviewed / rejected"
        timestamp applied_at
    }

    USERS ||--|| PROFILES : "has one"
    USERS ||--o{ JOBS : "creates (if employer)"
    JOBS ||--o{ APPLICATIONS : "receives"
    USERS ||--o{ APPLICATIONS : "applies (if junior)"