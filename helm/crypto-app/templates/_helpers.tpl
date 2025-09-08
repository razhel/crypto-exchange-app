{{/*
Create a default fully qualified app name.
*/}}
{{- define "crypto-app.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end }}

{{- define "crypto-app.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else }}
{{- printf "%s-%s" .Release.Name (include "crypto-app.name" .) | trunc 63 | trimSuffix "-" -}}
{{- end }}
{{- end }}

{{- define "crypto-app.labels" -}}
app.kubernetes.io/name: {{ include "crypto-app.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ .Chart.AppVersion }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{- define "crypto-app.selectorLabels" -}}
app.kubernetes.io/name: {{ include "crypto-app.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Return the ServiceAccount name.
*/}}
{{- define "crypto-app.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "crypto-app.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

