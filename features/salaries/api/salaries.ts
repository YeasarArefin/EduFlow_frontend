import { apiListRequest, apiRequest } from "@/lib/api/client";
export const SALARY_STATUSES=["pending","partially_paid","paid","overdue","waived"] as const;
export type SalaryStatus=typeof SALARY_STATUSES[number];
export type Salary={id:string;teacherId:string;salaryMonth:string;expectedSalary:string;adjustmentAmount:string;paidAmount:string;dueAmount:string;status:SalaryStatus;paymentStartDate:string;teacher?:{id:string;name:string;teacherCode:string}};
export type Payment={id:string;amount:string;paymentMethod:string;paymentDate:string;note:string|null;createdAt:string};
const h=(workspaceId:string)=>({"X-Workspace-Id":workspaceId});
export function getSalaries(workspaceId:string,p:{salaryMonth?:string;status?:SalaryStatus;page?:number;limit?:number;search?:string},signal?:AbortSignal){const q=new URLSearchParams({page:String(p.page??1),limit:String(p.limit??20)});if(p.salaryMonth)q.set("salaryMonth",p.salaryMonth);if(p.status)q.set("status",p.status);return apiListRequest<Salary[],{page:number;limit:number;total:number;totalPages:number}>(`/teacher-salaries?${q}`,{headers:h(workspaceId),signal});}
export const getPayments=(w:string,id:string)=>apiRequest<Payment[]>(`/teacher-salaries/${id}/payments`,{headers:h(w)});
export const recordPayment=(w:string,id:string,input:{amount:string;paymentMethod:string;paymentDate?:string;note?:string})=>apiRequest(`/teacher-salaries/${id}/payments`,{method:"POST",headers:h(w),body:input});
