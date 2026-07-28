package com.focoman.devportal.controller;

import com.focoman.devportal.dto.TaskResponse;
import com.focoman.devportal.service.DevPortalService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dev")
@CrossOrigin(origins = "*")
public class DevPortalController {

    private final DevPortalService devPortalService;

    public DevPortalController(DevPortalService devPortalService) {
        this.devPortalService = devPortalService;
    }

    @GetMapping("/tasks")
    public List<TaskResponse> getAllTasks() {
        return devPortalService.getAllTasks();
    }

    @GetMapping("/tasks/status/{status}")
    public List<TaskResponse> getTasksByStatus(@PathVariable String status) {
        return devPortalService.getTasksByStatus(status);
    }

    @GetMapping("/tasks/assignee/{assignee}")
    public List<TaskResponse> getTasksByAssignee(@PathVariable String assignee) {
        return devPortalService.getTasksByAssignee(assignee);
    }

    @PostMapping("/tasks")
    public ResponseEntity<TaskResponse> createTask(@RequestParam String title, @RequestParam String description, @RequestParam String type, @RequestParam String priority, @RequestParam String reportedBy, @RequestParam String module) {
        return ResponseEntity.ok(devPortalService.createTask(title, description, type, priority, reportedBy, module));
    }

    @PutMapping("/tasks/{taskId}/status")
    public ResponseEntity<TaskResponse> updateTaskStatus(@PathVariable String taskId, @RequestParam String status) {
        return ResponseEntity.ok(devPortalService.updateTaskStatus(taskId, status));
    }

    @PutMapping("/tasks/{taskId}/assign")
    public ResponseEntity<TaskResponse> assignTask(@PathVariable String taskId, @RequestParam String assignedTo) {
        return ResponseEntity.ok(devPortalService.assignTask(taskId, assignedTo));
    }

    @DeleteMapping("/tasks/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable String taskId) {
        devPortalService.deleteTask(taskId);
        return ResponseEntity.ok().build();
    }
}
