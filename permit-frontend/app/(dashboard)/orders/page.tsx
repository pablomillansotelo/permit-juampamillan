import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
  } from '@/components/ui/card';
  
  export default function CustomersPage() {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <CardDescription>View all orders.</CardDescription>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    );
  }
  