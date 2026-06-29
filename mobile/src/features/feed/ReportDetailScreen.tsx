import React from 'react';
import { ScrollView, Share, Text, Button } from 'react-native';

export default function ReportDetailScreen({ route }: any) {
  const r = route.params.report;
  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: '700' }}>{r.title}</Text>
      <Text style={{ color: '#888', marginVertical: 8 }}>{r.type} • {r.number} • {new Date(r.publishedAt).toLocaleString()}</Text>
      <Text>{r.body}</Text>
      <Button title="Share" onPress={() => Share.share({ message: r.title })} />
    </ScrollView>
  );
}
