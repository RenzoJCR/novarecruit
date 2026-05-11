import { createContext, useContext, useState } from "react";

import { jobs as initialJobs } from "../data/jobs.js";
import { applications as initialApplications } from "../data/applications.js";
import { evaluations as initialEvaluations } from "../data/evaluations.js";
import { notifications as initialNotifications } from "../data/notifications.js";
import { systemUsers as initialSystemUsers } from "../data/systemUsers.js";
import { areas as initialAreas } from "../data/areas.js";

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [jobs, setJobs] = useState(initialJobs);
  const [applications, setApplications] = useState(initialApplications);
  const [evaluations, setEvaluations] = useState(initialEvaluations);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [systemUsers, setSystemUsers] = useState(initialSystemUsers);
  const [areas, setAreas] = useState(initialAreas);

  const getCurrentDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  const createJob = (jobData) => {
    const newJob = {
      id: Date.now(),
      status: "Activa",
      publishedAt: getCurrentDate(),
      ...jobData,
    };

    setJobs((prevJobs) => [newJob, ...prevJobs]);

    return newJob;
  };

  const applyToJob = (job) => {
    const alreadyApplied = applications.some(
      (application) => application.jobTitle === job.title
    );

    if (alreadyApplied) {
      return {
        ok: false,
        message: "Ya postulaste a esta vacante.",
      };
    }

    const newApplication = {
      id: Date.now(),
      candidate: "Carlos Mendoza",
      jobTitle: job.title,
      area: job.area,
      status: "POSTULADO",
      appliedAt: getCurrentDate(),
      cvUrl: "https://drive.google.com/cv-carlos",
      skills: job.skills.map((skill) => ({
        name: skill.name,
        level: "Intermedio",
        years: 1,
      })),
    };

    setApplications((prevApplications) => [
      newApplication,
      ...prevApplications,
    ]);

    setNotifications((prevNotifications) => [
      {
        id: Date.now() + 1,
        title: "Postulación registrada",
        message: `Tu postulación a ${job.title} fue enviada correctamente.`,
        type: "success",
        read: false,
        date: getCurrentDate(),
      },
      ...prevNotifications,
    ]);

    return {
      ok: true,
      message: "Postulación registrada correctamente.",
    };
  };

  const updateApplicationStatus = (applicationId, newStatus) => {
    setApplications((prevApplications) =>
      prevApplications.map((application) =>
        application.id === applicationId
          ? {
              ...application,
              status: newStatus,
            }
          : application
      )
    );
  };

  const createEvaluation = (evaluationData) => {
    const newEvaluation = {
      id: Date.now(),
      status: "Disponible",
      assignedTo: null,
      assignedApplicationId: null,
      candidateVisibleScore: false,
      score: null,
      ...evaluationData,
    };

    setEvaluations((prevEvaluations) => [newEvaluation, ...prevEvaluations]);

    return newEvaluation;
  };

  const assignEvaluationToCandidate = (applicationId, evaluationId) => {
    const selectedApplication = applications.find(
      (application) => application.id === applicationId
    );

    if (!selectedApplication) {
      return {
        ok: false,
        message: "No se encontró la postulación seleccionada.",
      };
    }

    setEvaluations((prevEvaluations) =>
      prevEvaluations.map((evaluation) =>
        evaluation.id === Number(evaluationId)
          ? {
              ...evaluation,
              status: "Asignada",
              assignedTo: selectedApplication.candidate,
              assignedApplicationId: selectedApplication.id,
            }
          : evaluation
      )
    );

    setApplications((prevApplications) =>
      prevApplications.map((application) =>
        application.id === applicationId
          ? {
              ...application,
              status: "EVALUACION_PENDIENTE",
            }
          : application
      )
    );

    setNotifications((prevNotifications) => [
      {
        id: Date.now(),
        title: "Evaluación técnica asignada",
        message: `Tienes una evaluación técnica pendiente para la vacante ${selectedApplication.jobTitle}.`,
        type: "warning",
        read: false,
        date: getCurrentDate(),
      },
      ...prevNotifications,
    ]);

    return {
      ok: true,
      message: "Evaluación asignada correctamente.",
    };
  };

  const completeTechnicalReview = (applicationId, result) => {
    const newStatus =
      result === "approved" ? "APROBADO_TECNICO" : "RECHAZADO_TECNICO";

    setApplications((prevApplications) =>
      prevApplications.map((application) =>
        application.id === applicationId
          ? {
              ...application,
              status: newStatus,
            }
          : application
      )
    );

    setEvaluations((prevEvaluations) =>
      prevEvaluations.map((evaluation) =>
        evaluation.assignedApplicationId === applicationId
          ? {
              ...evaluation,
              status: "Calificada",
              score: result === "approved" ? 86 : 48,
            }
          : evaluation
      )
    );
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === notificationId
          ? {
              ...notification,
              read: true,
            }
          : notification
      )
    );
  };

  const createSystemUser = (userData) => {
    const newUser = {
      id: Date.now(),
      status: "Activo",
      createdAt: getCurrentDate(),
      ...userData,
    };

    setSystemUsers((prevUsers) => [newUser, ...prevUsers]);

    return newUser;
  };

  const createArea = (areaData) => {
    const newArea = {
      id: Date.now(),
      ...areaData,
    };

    setAreas((prevAreas) => [newArea, ...prevAreas]);

    return newArea;
  };

  return (
    <DataContext.Provider
      value={{
        jobs,
        applications,
        evaluations,
        notifications,
        systemUsers,
        areas,
        createJob,
        applyToJob,
        updateApplicationStatus,
        createEvaluation,
        assignEvaluationToCandidate,
        completeTechnicalReview,
        markNotificationAsRead,
        createSystemUser,
        createArea,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}