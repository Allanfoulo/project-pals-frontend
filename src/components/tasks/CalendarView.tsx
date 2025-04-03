import { useState } from "react";
import { useProjects } from "@/contexts/ProjectContext";
import { Task } from "@/contexts/ProjectContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, isSameDay, isSameMonth, addMonths, subMonths, startOfMonth, endOfMonth, isToday, isPast, isFuture } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from "lucide-react";
import CreateTaskModal from "./CreateTaskModal";

interface CalendarViewProps {
  projectId: string;
  className?: string;
}

const CalendarView = ({ projectId, className }: CalendarViewProps) => {
  const { projects } = useProjects();
  const project = projects.find((p) => p.id === projectId);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  if (!project) return null;
  
  const handlePreviousMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };
  
  const getTasksForDate = (date: Date) => {
    return project.tasks.filter(task => {
      if (!task.dueDate) return false;
      return isSameDay(new Date(task.dueDate), date);
    });
  };
  
  const getDaysInMonth = (date: Date) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    
    // Create an array of dates between start and end (inclusive)
    const days: Date[] = [];
    let currentDate = new Date(start);
    
    while (currentDate <= end) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };
  
  const daysInMonth = getDaysInMonth(currentMonth);
  const tasksForSelectedDate = selectedDate ? getTasksForDate(selectedDate) : [];
  
  // Get all tasks with due dates in the current month
  const tasksInMonth = project.tasks.filter(task => {
    if (!task.dueDate) return false;
    return isSameMonth(new Date(task.dueDate), currentMonth);
  });
  
  const getTaskCountForDate = (date: Date) => {
    return project.tasks.filter(task => {
      if (!task.dueDate) return false;
      return isSameDay(new Date(task.dueDate), date);
    }).length;
  };
  
  const getDateClassName = (date: Date) => {
    const isSelected = selectedDate && isSameDay(date, selectedDate);
    const isCurrentMonth = isSameMonth(date, currentMonth);
    const taskCount = getTaskCountForDate(date);
    
    let className = "h-10 w-10 rounded-full flex items-center justify-center text-sm relative ";
    
    if (isToday(date)) {
      className += "border border-primary ";
    }
    
    if (isSelected) {
      className += "bg-primary text-primary-foreground ";
    } else if (!isCurrentMonth) {
      className += "text-muted-foreground ";
    } else if (isPast(date) && !isToday(date)) {
      className += "text-muted-foreground ";
    }
    
    return className;
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500";
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-blue-500";
    }
  };
  
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="h-5 w-5" />
          <h2 className="text-xl font-semibold">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <CreateTaskModal projectId={projectId} />
        </div>
      </div>
      
      <div className="calendar-grid grid grid-cols-7 gap-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center text-sm font-medium py-2">
            {day}
          </div>
        ))}
        
        {daysInMonth.map((date) => {
          const taskCount = getTaskCountForDate(date);
          return (
            <div 
              key={date.toString()} 
              className="calendar-day min-h-16 sm:min-h-24 border border-border p-1 relative"
              onClick={() => setSelectedDate(date)}
            >
              <div className="flex justify-between items-start">
                <div className={getDateClassName(date)}>
                  {format(date, "d")}
                </div>
                {taskCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {taskCount}
                  </Badge>
                )}
              </div>
              
              <div className="mt-1 space-y-1 max-h-12 sm:max-h-16 overflow-hidden">
                {project.tasks
                  .filter(task => task.dueDate && isSameDay(new Date(task.dueDate), date))
                  .slice(0, 2)
                  .map(task => (
                    <div 
                      key={task.id} 
                      className={`calendar-task text-xs p-1 rounded truncate ${getPriorityColor(task.priority)} text-white`}
                    >
                      {task.title}
                    </div>
                  ))
                }
                {taskCount > 2 && (
                  <div className="text-xs text-muted-foreground text-center">
                    +{taskCount - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Tasks for {format(selectedDate, "MMMM d, yyyy")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tasksForSelectedDate.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                <p>No tasks scheduled for this day</p>
                <CreateTaskModal 
                  projectId={projectId} 
                  trigger={
                    <Button variant="outline" size="sm" className="mt-2">
                      <Plus className="h-4 w-4 mr-1" /> Add Task
                    </Button>
                  }
                />
              </div>
            ) : (
              <div className="space-y-2">
                {tasksForSelectedDate.map(task => (
                  <div 
                    key={task.id} 
                    className="p-2 border rounded-md flex items-start gap-2"
                  >
                    <div className={`w-1 self-stretch rounded-full ${getPriorityColor(task.priority)}`} />
                    <div className="flex-1">
                      <h3 className="font-medium">{task.title}</h3>
                      <p className="text-sm text-muted-foreground truncate">{task.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                        </Badge>
                        {task.assigneeId && (
                          <Badge variant="secondary" className="text-xs">
                            Assigned
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CalendarView;
