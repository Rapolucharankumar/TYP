'use client';

import React from 'react';
import ArticleForm from '../../../../components/ArticleForm';

export default function NewArticlePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">New Despatch</h1>
        <p className="text-xs text-muted mt-1">Compose and configure a new analytical essay for global publication.</p>
      </div>
      
      <ArticleForm />
    </div>
  );
}
