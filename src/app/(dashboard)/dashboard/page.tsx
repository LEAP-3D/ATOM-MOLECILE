"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
// import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/_components/ui/alert-dialog";
import type {
  SavedChartSummary,
  SavedChartsListResponse,
} from "@/app/_lib/saved-charts";

// Дээрх компонентуудыг импортлох
import { StatsCards } from "./StatsCards";
import { ChartCard, ChartCardSkeleton } from "./ChartCard";

export default function DashboardPage() {
  const [savedCharts, setSavedCharts] = useState<SavedChartSummary[]>([]);
  const [isLoadingCharts, setIsLoadingCharts] = useState(true);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const deleteTarget = useMemo(
    () => savedCharts.find((c) => c.id === deleteTargetId) ?? null,
    [savedCharts, deleteTargetId]
  );

  const fetchSavedCharts = useCallback(async () => {
    try {
      setIsLoadingCharts(true);
      const { data } = await axios.get<SavedChartsListResponse>(
        "/api/saved-charts"
      );
      setSavedCharts(data.charts);
    } catch (error) {
      toast.error(
        "Failed to load saved charts",
        error instanceof Error ? { description: error.message } : undefined
      );
    } finally {
      setIsLoadingCharts(false);
    }
  }, []);

  useEffect(() => {
    void fetchSavedCharts();
  }, [fetchSavedCharts]);

  const confirmDelete = async () => {
    if (!deleteTargetId || deletingId) return;
    try {
      setDeletingId(deleteTargetId);
      await axios.delete(`/api/saved-charts/${deleteTargetId}`);
      setSavedCharts((prev) => prev.filter((c) => c.id !== deleteTargetId));
      setIsDeleteOpen(false);
    } catch (error) {
      toast.error(
        "Failed to delete chart",
        error instanceof Error ? { description: error.message } : undefined
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome to <span className="gradient-text">DataViz Studio</span>
        </h1>
        <p className="text-muted-foreground">
          Manage and continue building your saved charts
        </p>
      </header>

      <StatsCards />

      <h2 className="text-xl font-semibold mb-4">Saved Charts</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoadingCharts
          ? Array.from({ length: 3 }).map((_, i) => (
              <ChartCardSkeleton key={i} />
            ))
          : savedCharts.map((chart, i) => (
              <ChartCard
                key={chart.id}
                chart={chart}
                index={i}
                deletingId={deletingId}
                onRequestDelete={(id) => {
                  setDeleteTargetId(id);
                  setIsDeleteOpen(true);
                }}
              />
            ))}
      </div>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete saved chart?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget
                ? `Remove "${deleteTarget.title || "Untitled"}"?`
                : "This cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={!!deletingId}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive"
              onClick={(e) => {
                e.preventDefault();
                void confirmDelete();
              }}
              disabled={!!deletingId}
            >
              {deletingId ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
