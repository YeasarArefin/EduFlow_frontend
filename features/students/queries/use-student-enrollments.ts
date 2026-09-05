"use client";
import { useQuery } from "@tanstack/react-query";
import { getStudentEnrollments } from "../api/enrollments";
export const useStudentEnrollments=(workspaceId:string,studentId:string)=>useQuery({queryKey:["students",workspaceId,studentId,"enrollments"],queryFn:({signal})=>getStudentEnrollments(workspaceId,studentId,signal),enabled:Boolean(workspaceId&&studentId),staleTime:30_000});
