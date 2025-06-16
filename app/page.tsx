"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, AlertTriangle, Building2, GraduationCap, Calendar, Clock, Users, BookOpen } from "lucide-react"

// Tipos de datos
interface Universidad {
  id: string
  nombreUniversidad: string
}

interface Proyecto {
  numeroProyecto: string
  nombreProyecto: string
  descripcionProyecto: string
  fechaHoraInicioPostulaciones: string
  fechaHoraCierrePostulaciones: string
  fechaInicioActividades: string
  fechaFinProyecto: string
  nombreEmpresa: string
}

interface Puesto {
  codPuesto: string
  nombrePuesto: string
  descripcionPuesto: string
  horasDedicadas: number
  nombreCarrera: string
  cantMateriasAprobadasReq: number
  cantMateriasRegularesReq: number
  cantVacantes: number
}

interface ErrorState {
  show: boolean
  message: string
  type: "error" | "success"
}

// Datos mock
const universidades: Universidad[] = [
  { id: "1", nombreUniversidad: "Universidad Tecnológica Nacional - Facultad Regional de Mendoza" },
  { id: "2", nombreUniversidad: "Universidad Nacional de Cuyo" },
  { id: "3", nombreUniversidad: "Universidad de Mendoza" },
  { id: "4", nombreUniversidad: "Universidad Aconcagua" },
  { id: "5", nombreUniversidad: "Universidad de Congreso" },
]

const proyectos: Proyecto[] = [
  {
    numeroProyecto: "PROJ001",
    nombreProyecto: "Sistema de Gestión Empresarial",
    descripcionProyecto:
      "Desarrollo de un sistema integral para la gestión de recursos empresariales con tecnologías modernas.",
    fechaHoraInicioPostulaciones: "2025-06-15T09:00:00",
    fechaHoraCierrePostulaciones: "2025-08-15T18:00:00",
    fechaInicioActividades: "2025-09-15T09:00:00",
    fechaFinProyecto: "2026-02-28T18:00:00",
    nombreEmpresa: "TechCorp Solutions",
  },
  {
    numeroProyecto: "PROJ002",
    nombreProyecto: "Plataforma E-Learning",
    descripcionProyecto: "Creación de una plataforma educativa online con funcionalidades avanzadas de aprendizaje.",
    fechaHoraInicioPostulaciones: "2025-06-20T08:00:00",
    fechaHoraCierrePostulaciones: "2025-07-20T17:00:00",
    fechaInicioActividades: "2025-08-20T09:00:00",
    fechaFinProyecto: "2026-01-15T18:00:00",
    nombreEmpresa: "EduTech Innovations",
  },
]

const puestos: Puesto[] = [
  {
    codPuesto: "DEV001",
    nombrePuesto: "Desarrollador Frontend",
    descripcionPuesto: "Desarrollo de interfaces de usuario utilizando React y tecnologías modernas de frontend.",
    horasDedicadas: 20,
    nombreCarrera: "Ingeniería en Sistemas",
    cantMateriasAprobadasReq: 25,
    cantMateriasRegularesReq: 5,
    cantVacantes: 2,
  },
  {
    codPuesto: "DEV002",
    nombrePuesto: "Ingeniero de Procesos",
    descripcionPuesto:
      "Optimización y control de procesos industriales, análisis de eficiencia y desarrollo de mejoras en plantas de producción.",
    horasDedicadas: 25,
    nombreCarrera: "Ingeniería Química",
    cantMateriasAprobadasReq: 30,
    cantMateriasRegularesReq: 3,
    cantVacantes: 1,
  },
  {
    codPuesto: "ELEC001",
    nombrePuesto: "Ingeniero Electrónico",
    descripcionPuesto:
      "Diseño y desarrollo de sistemas electrónicos, programación de microcontroladores y mantenimiento de equipos industriales.",
    horasDedicadas: 20,
    nombreCarrera: "Ingeniería Electrónica",
    cantMateriasAprobadasReq: 28,
    cantMateriasRegularesReq: 4,
    cantVacantes: 2,
  },
]

export default function PostulacionProyecto() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedUniversidad, setSelectedUniversidad] = useState("")
  const [nroLegajo, setNroLegajo] = useState("")
  const [selectedProyecto, setSelectedProyecto] = useState<Proyecto | null>(null)
  const [selectedPuesto, setSelectedPuesto] = useState<Puesto | null>(null)
  const [error, setError] = useState<ErrorState>({ show: false, message: "", type: "error" })
  const [loading, setLoading] = useState(false)

  const showError = (message: string, type: "error" | "success" = "error") => {
    setError({ show: true, message, type })
    setTimeout(() => setError({ show: false, message: "", type: "error" }), 5000)
  }

  const validateLegajo = async () => {
    // Validar que no esté vacío
    if (!nroLegajo.trim()) {
      showError("Los datos ingresados no son válidos. Intenta nuevamente.")
      return false
    }

    // Validar formato de legajo (solo números, mínimo 4 dígitos, máximo 8 dígitos)
    const legajoRegex = /^\d{4,8}$/
    if (!legajoRegex.test(nroLegajo.trim())) {
      showError("Los datos ingresados no son válidos. Intenta nuevamente.")
      return false
    }

    setLoading(true)

    // Simulación de validación con sistema académico
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Simulación de casos de error específicos
    if (nroLegajo === "00000") {
      showError("No se ha podido encontrar el Estudiante. Intente nuevamente")
      setLoading(false)
      return false
    }

    setLoading(false)
    return true
  }

  const handlePostulacion = async (confirmar: boolean) => {
    if (!confirmar) {
      // Si es CA N°3 (postulación fuera de fecha), volver a proyectos
      if (nroLegajo === "99999") {
        setCurrentStep(3) // Volver a selección de proyectos
      } else {
        setCurrentStep(4) // Volver a selección de puestos
      }
      return
    }

    if (!selectedPuesto) {
      return
    }

    // Validaciones que impiden la postulación (se ejecutan antes de registrar)

    // CA N°3: Postulación fuera de fecha
    if (nroLegajo === "99999") {
      showError(`La postulación al proyecto ${selectedProyecto?.nombreProyecto} ha cerrado.`)
      return false
    }

    // CA N°4: Cupo máximo del puesto alcanzado
    if (nroLegajo === "11111") {
      showError("No se ha podido completar la postulación al Puesto. Se ha superado el número máximo de postulaciones")
      return false
    }

    // CA N°5: Postulación existente
    if (nroLegajo === "12345") {
      showError(
        `Usted ya se encuentra postulado a Puesto ${selectedPuesto.nombrePuesto} del Proyecto ${selectedProyecto?.nombreProyecto}`,
      )
      return false
    }

    // CA N°6: Estudiante no cumple requisito de carrera
    if (nroLegajo === "22222") {
      showError("No es posible postularse al puesto seleccionado. No pertenece a la carrera solicitada")
      return false
    }

    // CA N°7: Estudiante no cumple requisito cantidad materias aprobadas
    if (nroLegajo === "33333") {
      showError(
        "No es posible postularse al puesto seleccionado. No cumple con la cantidad de materias aprobadas requeridas",
      )
      return false
    }

    // CA N°8: Estudiante no cumple requisito cantidad materias regulares
    if (nroLegajo === "44444") {
      showError(
        "No es posible postularse al puesto seleccionado. No cumple con la cantidad de materias regulares requeridas",
      )
      return false
    }

    // Si todas las validaciones pasan, proceder con la postulación
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setLoading(false)

    // La postulación se registra exitosamente
    showError("Postulación exitosa al proyecto", "success")

    // CA N°10: Cupo máximo del proyecto alcanzado (ocurre DESPUÉS de la postulación exitosa)
    if (nroLegajo === "55555") {
      // Simular que esta postulación llenó el cupo del proyecto
      // Según el flujo: se cambian estados y se ejecuta algoritmo de selección
      // Esto ocurre en background, el usuario no ve ningún mensaje de error
      console.log("CA N°10: Cupo del proyecto alcanzado - ejecutando algoritmo de selección...")
      // En una implementación real aquí se ejecutaría el algoritmo de selección
    }

    setCurrentStep(6) // Pantalla de éxito
  }

  const resetForm = () => {
    setCurrentStep(1)
    setSelectedUniversidad("")
    setNroLegajo("")
    setSelectedProyecto(null)
    setSelectedPuesto(null)
    setError({ show: false, message: "", type: "error" })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sistema de Postulación a Proyectos</h1>
          <p className="text-gray-600">Complete el proceso paso a paso para postularse a un proyecto</p>
        </div>

        {/* Indicador de progreso */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3, 4, 5, 6].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step}
                </div>
                {step < 6 && <div className={`w-12 h-1 mx-2 ${currentStep > step ? "bg-blue-600" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2">
            <span className="text-sm text-gray-600">Paso {currentStep} de 6</span>
          </div>
        </div>

        {/* GUI N°1: Selección de Universidad */}
        {currentStep === 1 && (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>Seleccionar Universidad</CardTitle>
              <CardDescription>Elija su universidad para continuar con el proceso de postulación</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="universidad">Universidad</Label>
                <Select value={selectedUniversidad} onValueChange={setSelectedUniversidad}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione una universidad" />
                  </SelectTrigger>
                  <SelectContent>
                    {universidades.map((uni) => (
                      <SelectItem key={uni.id} value={uni.id}>
                        {uni.nombreUniversidad}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full" onClick={() => setCurrentStep(2)} disabled={!selectedUniversidad}>
                Continuar
              </Button>
            </CardContent>
          </Card>
        )}

        {/* GUI N°2: Ingreso de legajo */}
        {currentStep === 2 && (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>Datos del Estudiante</CardTitle>
              <CardDescription>Ingrese legajo del Estudiante</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="legajo">Número de Legajo</Label>
                <Input
                  id="legajo"
                  type="text"
                  placeholder="Ej: 12345"
                  value={nroLegajo}
                  onChange={(e) => setNroLegajo(e.target.value)}
                />
                {/* Mensaje de error debajo del campo */}
                {error.show && error.type === "error" && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2">
                    <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <span className="text-red-800 text-sm">{error.message}</span>
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" className="flex-1" onClick={() => setCurrentStep(1)}>
                  Atrás
                </Button>
                <Button
                  className="flex-1"
                  onClick={async () => {
                    if (await validateLegajo()) {
                      setCurrentStep(3)
                    }
                  }}
                  disabled={loading}
                >
                  {loading ? "Validando..." : "Continuar"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* GUI N°3: Lista de proyectos */}
        {currentStep === 3 && (
          <Card className="w-full">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>Proyectos Disponibles</CardTitle>
              <CardDescription>Seleccione el proyecto al que desea postularse</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {proyectos.map((proyecto) => (
                <Card
                  key={proyecto.numeroProyecto}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedProyecto?.numeroProyecto === proyecto.numeroProyecto
                      ? "ring-2 ring-blue-500 bg-blue-50"
                      : ""
                  }`}
                  onClick={() => setSelectedProyecto(proyecto)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{proyecto.nombreProyecto}</h3>
                        <p className="text-sm text-gray-600 flex items-center mt-1">
                          <Building2 className="w-4 h-4 mr-1" />
                          {proyecto.nombreEmpresa}
                        </p>
                      </div>
                      <Badge variant="outline">{proyecto.numeroProyecto}</Badge>
                    </div>

                    <p className="text-gray-700 mb-3 text-sm">{proyecto.descripcionProyecto}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-gray-600">
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>Cierre postulaciones: {formatDate(proyecto.fechaHoraCierrePostulaciones)}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>Inicio actividades: {formatDate(proyecto.fechaInicioActividades)}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>Fin proyecto: {formatDate(proyecto.fechaFinProyecto)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <div className="flex space-x-2 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setCurrentStep(2)}>
                  Atrás
                </Button>
                <Button className="flex-1" onClick={() => setCurrentStep(4)} disabled={!selectedProyecto}>
                  Ver Puestos
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* GUI N°4: Lista de puestos */}
        {currentStep === 4 && selectedProyecto && (
          <Card className="w-full">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-orange-600" />
              </div>
              <CardTitle>Puestos Disponibles</CardTitle>
              <CardDescription>Proyecto: {selectedProyecto.nombreProyecto}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {puestos.map((puesto) => (
                <Card
                  key={puesto.codPuesto}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedPuesto?.codPuesto === puesto.codPuesto ? "ring-2 ring-blue-500 bg-blue-50" : ""
                  }`}
                  onClick={() => setSelectedPuesto(puesto)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{puesto.nombrePuesto}</h3>
                        <p className="text-sm text-gray-600">{puesto.codPuesto}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">
                          {puesto.cantVacantes} vacante{puesto.cantVacantes !== 1 ? "s" : ""}
                        </Badge>
                        <p className="text-xs text-gray-600 mt-1">{puesto.horasDedicadas}h/semana</p>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-3 text-sm">{puesto.descripcionPuesto}</p>

                    <Separator className="my-3" />

                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Requisitos:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                        <div className="bg-gray-50 p-2 rounded">
                          <span className="font-medium">Carrera:</span>
                          <br />
                          {puesto.nombreCarrera}
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <span className="font-medium">Mat. Aprobadas:</span>
                          <br />
                          Mínimo {puesto.cantMateriasAprobadasReq}
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <span className="font-medium">Mat. Regulares:</span>
                          <br />
                          Mínimo {puesto.cantMateriasRegularesReq}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <div className="flex space-x-2 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setCurrentStep(3)}>
                  Atrás
                </Button>
                <Button className="flex-1" onClick={() => setCurrentStep(5)} disabled={!selectedPuesto}>
                  Postularse
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* GUI N°5: Confirmación de postulación */}
        {currentStep === 5 && selectedProyecto && selectedPuesto && (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <CardTitle>Confirmar Postulación</CardTitle>
              <CardDescription>¿Desea Postularse al puesto seleccionado?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <h3 className="font-semibold">Resumen de su postulación:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Proyecto:</span>
                    <p>{selectedProyecto.nombreProyecto}</p>
                  </div>
                  <div>
                    <span className="font-medium">Empresa:</span>
                    <p>{selectedProyecto.nombreEmpresa}</p>
                  </div>
                  <div>
                    <span className="font-medium">Puesto:</span>
                    <p>{selectedPuesto.nombrePuesto}</p>
                  </div>
                  <div>
                    <span className="font-medium">Dedicación:</span>
                    <p>{selectedPuesto.horasDedicadas} horas/semana</p>
                  </div>
                  <div>
                    <span className="font-medium">Legajo:</span>
                    <p>{nroLegajo}</p>
                  </div>
                  <div>
                    <span className="font-medium">Universidad:</span>
                    <p>{universidades.find((u) => u.id === selectedUniversidad)?.nombreUniversidad}</p>
                  </div>
                </div>
              </div>

              {/* Mensaje de error debajo del resumen */}
              {error.show && error.type === "error" && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span className="text-red-800 text-sm">{error.message}</span>
                </div>
              )}

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handlePostulacion(false)}
                  disabled={loading}
                >
                  No
                </Button>
                <Button className="flex-1" onClick={() => handlePostulacion(true)} disabled={loading}>
                  {loading ? "Procesando..." : "Sí, Postularme"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* GUI N°6: Postulación exitosa */}
        {currentStep === 6 && (
          <Card className="w-full max-w-md mx-auto text-center">
            <CardContent className="p-8">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-green-800 mb-4">¡Postulación Exitosa!</h2>
              <p className="text-gray-600 mb-6">Su postulación al proyecto ha sido registrada correctamente.</p>
              <Button onClick={resetForm} className="w-full">
                Nueva Postulación
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
