import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Shield, Lock, Brain, ClipboardCheck, FileCheck, Users, Server, Key, Timer, Database, CheckCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const HipaaCompliance: React.FC = () => {
  const { t, lang } = useLanguage();

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;
    let y = 20;

    const addText = (text: string, fontSize: number, isBold: boolean = false, color: [number, number, number] = [0, 0, 0]) => {
      doc.setFontSize(fontSize);
      doc.setFont("helvetica", isBold ? "bold" : "normal");
      doc.setTextColor(...color);
      const lines = doc.splitTextToSize(text, maxWidth);
      doc.text(lines, margin, y);
      y += lines.length * (fontSize * 0.4) + 4;
    };

    const addSection = (title: string, content: string[]) => {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      addText(title, 14, true, [75, 85, 72]);
      content.forEach((para) => {
        addText(para, 10, false);
      });
      y += 6;
    };

    // Header
    addText("HUMBLE PATHWAYS", 24, true, [75, 85, 72]);
    addText("HIPAA Compliance & Data Privacy Overview", 16, true, [107, 87, 59]);
    y += 4;
    addText("Prepared for: Mental Health Clinicians, Health Systems, and Psychiatric Facilities", 10, false, [100, 100, 100]);
    y += 10;

    addText("At Humble Pathways, we recognize that mental health data is among the most sensitive information in the healthcare ecosystem. Our platform is engineered to meet and exceed the HIPAA Security and Privacy Rule requirements, providing clinicians with a secure environment for AI-assisted care.", 11, false);
    y += 8;

    // Section 1
    addSection("1. Legal Accountability (The BAA)", [
      "Humble Pathways operates as a Business Associate under HIPAA law.",
      "The Guarantee: We provide a signed Business Associate Agreement (BAA) to all institutional partners. This document contractually binds Humble Pathways to the federal standards of data protection, ensuring we are legally liable for the safety of the PHI we process.",
      "Total Coverage: Our entire technical ecosystem—from data storage to processing—is covered by matching BAAs, ensuring no \"gaps\" in the legal chain of custody.",
    ]);

    // Section 2
    addSection("2. Technical Safeguards & Data Hardening", [
      "We utilize \"Secure-by-Design\" principles to ensure that clinician and patient data remains private and protected.",
      "Encryption Standards: All Protected Health Information (PHI) is encrypted at rest using AES-256 and in transit via TLS 1.2+. Data is never stored or transmitted in plain text.",
      "Clinician Data Isolation: Our architecture uses Row-Level Security. This creates a digital \"silo\" for every clinic or ward; it is technically impossible for a clinician from one department to view data belonging to another.",
      "MFA Enforcement: To prevent unauthorized access via stolen credentials, Humble Pathways enforces Multi-Factor Authentication (MFA) for every clinician login.",
    ]);

    // Section 3
    addSection("3. AI Ethics & Clinical Privacy", [
      "Because we are an AI-powered platform, we take extra steps to ensure \"clinical hygiene\".",
      "No Training on PHI: Humble Pathways does not use patient data or clinical notes to train general AI models. Your data stays within your secure instance.",
      "De-identification: Our AI processing is designed to minimize the use of identifiers, focusing strictly on the clinical narrative required for the task.",
      "Psychotherapy Note Protection: We recognize the heightened sensitivity of process notes. Our system allows for the separation of psychotherapy notes from the general medical record, as suggested by HIPAA guidelines.",
    ]);

    // Section 4
    addSection("4. Auditability & Oversight", [
      "We provide the transparency required for institutional oversight and hospital compliance audits.",
      "Access Logs: Every instance of data access, modification, or deletion is recorded in an immutable audit log.",
      "Session Security: Our app includes automatic session timeouts, a critical feature for clinicians using shared workstations in psychiatric wards or hospital hallways.",
    ]);

    // Compliance Summary Table
    if (y > 200) {
      doc.addPage();
      y = 20;
    }
    addText("Summary of Compliance Markers", 14, true, [75, 85, 72]);
    y += 4;

    const tableData = [
      ["Legal", "Signed BAA provided to all partner organizations."],
      ["Integrity", "Advanced checksums to ensure data hasn't been altered."],
      ["Access", "Strict Role-Based Access Control (RBAC) and MFA."],
      ["Transmission", "End-to-end encrypted tunnels for all communication."],
      ["Availability", "Geo-redundant backups with Point-in-Time recovery."],
    ];

    tableData.forEach(([req, impl], i) => {
      doc.setFillColor(i % 2 === 0 ? 245 : 255, i % 2 === 0 ? 245 : 255, i % 2 === 0 ? 240 : 255);
      doc.rect(margin, y - 4, maxWidth, 12, "F");
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(50, 50, 50);
      doc.text(req, margin + 2, y + 3);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(80, 80, 80);
      doc.text(impl, margin + 45, y + 3);
      y += 12;
    });

    y += 10;
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text(`© ${new Date().getFullYear()} Humble Pathways · Humanity Pathways Global`, margin, y);

    doc.save("Humble-Pathways-HIPAA-Compliance.pdf");
  };

  const complianceMarkers = [
    { label: t("Legal", "Legal"), value: t("Signed BAA provided to all partner organizations.", "BAA firmado proporcionado a todas las organizaciones asociadas.") },
    { label: t("Integrity", "Integridad"), value: t("Advanced checksums to ensure data hasn't been altered.", "Sumas de verificación avanzadas para asegurar que los datos no han sido alterados.") },
    { label: t("Access", "Acceso"), value: t("Strict Role-Based Access Control (RBAC) and MFA.", "Control de acceso estricto basado en roles (RBAC) y MFA.") },
    { label: t("Transmission", "Transmisión"), value: t("End-to-end encrypted tunnels for all communication.", "Túneles cifrados de extremo a extremo para toda comunicación.") },
    { label: t("Availability", "Disponibilidad"), value: t("Geo-redundant backups with Point-in-Time recovery.", "Copias de seguridad geo-redundantes con recuperación a un punto en el tiempo.") },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="py-20 md:py-28 bg-cream">
        <div className="container max-w-3xl text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6 }}>
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <p className="text-primary font-medium text-sm tracking-wider uppercase mb-4">
              {t("HIPAA Compliance & Data Privacy", "Cumplimiento HIPAA y Privacidad de Datos")}
            </p>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              {t("Your data is sacred. We treat it that way.", "Tus datos son sagrados. Los tratamos así.")}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              {t(
                "Prepared for mental health clinicians, health systems, and psychiatric facilities. Our platform is engineered to meet and exceed HIPAA Security and Privacy Rule requirements.",
                "Preparado para clínicos de salud mental, sistemas de salud e instalaciones psiquiátricas. Nuestra plataforma está diseñada para cumplir y superar los requisitos de las reglas de seguridad y privacidad de HIPAA."
              )}
            </p>
            <Button onClick={generatePDF} className="gap-2">
              <Download className="w-4 h-4" />
              {t("Download PDF for Institutional Partners", "Descargar PDF para Socios Institucionales")}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Section 1 — Legal Accountability */}
      <section className="py-20 md:py-28">
        <div className="container max-w-4xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gold-light flex items-center justify-center">
                <FileCheck className="w-5 h-5 text-accent" />
              </div>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
                {t("1. Legal Accountability — The BAA", "1. Responsabilidad Legal — El BAA")}
              </h2>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-6">
              {t(
                "Humble Pathways operates as a Business Associate under HIPAA law.",
                "Humble Pathways opera como Asociado Comercial bajo la ley HIPAA."
              )}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-card border border-border">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  {t("The Guarantee", "La Garantía")}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(
                    "We provide a signed Business Associate Agreement (BAA) to all institutional partners. This document contractually binds Humble Pathways to the federal standards of data protection, ensuring we are legally liable for the safety of the PHI we process.",
                    "Proporcionamos un Acuerdo de Asociado Comercial (BAA) firmado a todos los socios institucionales. Este documento vincula contractualmente a Humble Pathways con los estándares federales de protección de datos, asegurando que somos legalmente responsables de la seguridad de la PHI que procesamos."
                  )}
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-card border border-border">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  {t("Total Coverage", "Cobertura Total")}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(
                    "Our entire technical ecosystem—from data storage to processing—is covered by matching BAAs, ensuring no \"gaps\" in the legal chain of custody.",
                    "Todo nuestro ecosistema técnico—desde el almacenamiento hasta el procesamiento de datos—está cubierto por BAAs correspondientes, asegurando que no haya \"brechas\" en la cadena legal de custodia."
                  )}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 2 — Technical Safeguards */}
      <section className="py-20 md:py-28 bg-sage-light">
        <div className="container max-w-4xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gold-light flex items-center justify-center">
                <Lock className="w-5 h-5 text-accent" />
              </div>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
                {t("2. Technical Safeguards & Data Hardening", "2. Salvaguardas Técnicas y Endurecimiento de Datos")}
              </h2>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-8">
              {t(
                "We utilize \"Secure-by-Design\" principles to ensure that clinician and patient data remains private and protected.",
                "Utilizamos principios de \"Seguro por Diseño\" para asegurar que los datos de clínicos y pacientes permanezcan privados y protegidos."
              )}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: Server,
                  titleEn: "Encryption Standards",
                  titleEs: "Estándares de Cifrado",
                  descEn: "All PHI is encrypted at rest using AES-256 and in transit via TLS 1.2+. Data is never stored or transmitted in plain text.",
                  descEs: "Toda la PHI está cifrada en reposo usando AES-256 y en tránsito vía TLS 1.2+. Los datos nunca se almacenan ni transmiten en texto plano.",
                },
                {
                  icon: Database,
                  titleEn: "Clinician Data Isolation",
                  titleEs: "Aislamiento de Datos Clínicos",
                  descEn: "Our architecture uses Row-Level Security. This creates a digital \"silo\" for every clinic or ward; it is technically impossible for a clinician from one department to view data belonging to another.",
                  descEs: "Nuestra arquitectura usa Seguridad a Nivel de Fila. Esto crea un \"silo\" digital para cada clínica o unidad; es técnicamente imposible que un clínico de un departamento vea datos de otro.",
                },
                {
                  icon: Key,
                  titleEn: "MFA Enforcement",
                  titleEs: "Aplicación de MFA",
                  descEn: "To prevent unauthorized access via stolen credentials, Humble Pathways enforces Multi-Factor Authentication (MFA) for every clinician login.",
                  descEs: "Para prevenir el acceso no autorizado mediante credenciales robadas, Humble Pathways impone Autenticación Multifactor (MFA) para cada inicio de sesión clínico.",
                },
              ].map((item, i) => (
                <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="p-6 rounded-2xl bg-card border border-border">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-heading text-base font-semibold text-foreground mb-2">{t(item.titleEn, item.titleEs)}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t(item.descEn, item.descEs)}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 3 — AI Ethics */}
      <section className="py-20 md:py-28">
        <div className="container max-w-4xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gold-light flex items-center justify-center">
                <Brain className="w-5 h-5 text-accent" />
              </div>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
                {t("3. AI Ethics & Clinical Privacy", "3. Ética de IA y Privacidad Clínica")}
              </h2>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-8">
              {t(
                "Because we are an AI-powered platform, we take extra steps to ensure \"clinical hygiene\".",
                "Debido a que somos una plataforma impulsada por IA, tomamos pasos adicionales para asegurar la \"higiene clínica\"."
              )}
            </p>
            <div className="space-y-4">
              {[
                {
                  titleEn: "No Training on PHI",
                  titleEs: "Sin Entrenamiento con PHI",
                  descEn: "Humble Pathways does not use patient data or clinical notes to train general AI models. Your data stays within your secure instance.",
                  descEs: "Humble Pathways no utiliza datos de pacientes ni notas clínicas para entrenar modelos de IA generales. Sus datos permanecen dentro de su instancia segura.",
                },
                {
                  titleEn: "De-identification",
                  titleEs: "Des-identificación",
                  descEn: "Our AI processing is designed to minimize the use of identifiers, focusing strictly on the clinical narrative required for the task.",
                  descEs: "Nuestro procesamiento de IA está diseñado para minimizar el uso de identificadores, enfocándose estrictamente en la narrativa clínica requerida para la tarea.",
                },
                {
                  titleEn: "Psychotherapy Note Protection",
                  titleEs: "Protección de Notas de Psicoterapia",
                  descEn: "We recognize the heightened sensitivity of process notes. Our system allows for the separation of psychotherapy notes from the general medical record, as suggested by HIPAA guidelines.",
                  descEs: "Reconocemos la mayor sensibilidad de las notas de proceso. Nuestro sistema permite la separación de las notas de psicoterapia del expediente médico general, según lo sugerido por las pautas de HIPAA.",
                },
              ].map((item, i) => (
                <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="p-6 rounded-2xl bg-card border border-border flex gap-4">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-heading text-base font-semibold text-foreground mb-1">{t(item.titleEn, item.titleEs)}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t(item.descEn, item.descEs)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 4 — Auditability */}
      <section className="py-20 md:py-28 bg-sage-light">
        <div className="container max-w-4xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gold-light flex items-center justify-center">
                <ClipboardCheck className="w-5 h-5 text-accent" />
              </div>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
                {t("4. Auditability & Oversight", "4. Auditabilidad y Supervisión")}
              </h2>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-8">
              {t(
                "We provide the transparency required for institutional oversight and hospital compliance audits.",
                "Proporcionamos la transparencia requerida para la supervisión institucional y las auditorías de cumplimiento hospitalario."
              )}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-card border border-border">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-heading text-base font-semibold text-foreground mb-2">{t("Access Logs", "Registros de Acceso")}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(
                    "Every instance of data access, modification, or deletion is recorded in an immutable audit log.",
                    "Cada instancia de acceso, modificación o eliminación de datos se registra en un registro de auditoría inmutable."
                  )}
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-card border border-border">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Timer className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-heading text-base font-semibold text-foreground mb-2">{t("Session Security", "Seguridad de Sesión")}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(
                    "Our app includes automatic session timeouts, a critical feature for clinicians using shared workstations in psychiatric wards or hospital hallways.",
                    "Nuestra aplicación incluye tiempos de espera automáticos de sesión, una característica crítica para clínicos que usan estaciones de trabajo compartidas en unidades psiquiátricas o pasillos hospitalarios."
                  )}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Compliance Summary Table */}
      <section className="py-20 md:py-28">
        <div className="container max-w-3xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }}>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
              {t("Summary of Compliance Markers", "Resumen de Marcadores de Cumplimiento")}
            </h2>
            <div className="rounded-2xl border border-border overflow-hidden">
              <div className="grid grid-cols-[140px_1fr] md:grid-cols-[180px_1fr] bg-primary text-primary-foreground">
                <div className="p-4 font-heading font-semibold text-sm">{t("Requirement", "Requisito")}</div>
                <div className="p-4 font-heading font-semibold text-sm border-l border-primary-foreground/20">{t("Implementation", "Implementación")}</div>
              </div>
              {complianceMarkers.map((row, i) => (
                <div key={i} className={`grid grid-cols-[140px_1fr] md:grid-cols-[180px_1fr] ${i % 2 === 0 ? "bg-card" : "bg-muted/50"}`}>
                  <div className="p-4 font-medium text-sm text-foreground">{row.label}</div>
                  <div className="p-4 text-sm text-muted-foreground border-l border-border">{row.value}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default HipaaCompliance;
