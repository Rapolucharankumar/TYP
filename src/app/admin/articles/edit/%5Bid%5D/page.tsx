'use client';

import React, { use } from 'react';
import ArticleForm from '../../../../../components/ArticleForm';

interface EditProps {
  params: Promise<{ id: string }>;
}

export default function EditArticlePage({ params }: EditProps) {
  const { id } = use(params);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Edit Despatch</h1>
        <p className="text-xs text-muted mt-1">Amend editorial contents, adjust settings, and schedule publishing.</p>
      </div>
      
      <ArticleForm articleId={id} />
    </div>
  );
}
