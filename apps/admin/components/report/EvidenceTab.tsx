'use client';

import EvidenceList from '@/components/report/EvidenceList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { TEvidence } from '@/services/report.seller.api';
import { PlusCircle } from 'lucide-react';

interface EvidenceTabProps {
  evidence: TEvidence[];
  loading: boolean;
  onRefresh: () => void;
  onAddEvidence: () => void;
}

export default function EvidenceTab({
  evidence,
  loading,
  onRefresh,
  onAddEvidence,
}: EvidenceTabProps) {
  return (
    <Card className="shadow-lg shadow-slate-200/50 border-slate-200/50 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-3 border-b border-slate-200/50 bg-slate-50/50 flex flex-row items-center justify-between">
        <CardTitle className="text-lg text-slate-900">Bằng chứng</CardTitle>
        <Button
          onClick={onAddEvidence}
          size="sm"
          className="ml-auto bg-orange-500 hover:bg-orange-600 text-white"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Thêm bằng chứng
        </Button>
      </CardHeader>
      <CardContent className="pt-4">
        <EvidenceList evidence={evidence} loading={loading} onRefresh={onRefresh} />
      </CardContent>
    </Card>
  );
}
