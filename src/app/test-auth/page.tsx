import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

export default async function TestAuthPage() {
  const { userId } = auth();
  
  // Test Supabase connection
  const { data: testData, error: dbError } = await supabaseAdmin
    .from("saved_recipes")
    .select("count", { count: "exact", head: true });

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Diagnostics Page</h1>
      
      <section className="p-4 bg-gray-100 rounded-lg">
        <h2 className="font-semibold mb-2">1. Clerk Auth Status</h2>
        {userId ? (
          <p className="text-green-600">✅ Logged in as: <code className="bg-white px-1">{userId}</code></p>
        ) : (
          <p className="text-red-600">❌ Not logged in (userId is null)</p>
        )}
      </section>

      <section className="p-4 bg-gray-100 rounded-lg">
        <h2 className="font-semibold mb-2">2. Supabase Admin Connection</h2>
        {dbError ? (
          <div className="text-red-600">
            <p>❌ Connection failed</p>
            <pre className="text-xs mt-2 p-2 bg-white rounded overflow-auto">
              {JSON.stringify(dbError, null, 2)}
            </pre>
          </div>
        ) : (
          <p className="text-green-600">✅ Connection successful! Accessible tables: saved_recipes</p>
        )}
      </section>

      <section className="p-4 bg-gray-100 rounded-lg">
        <h2 className="font-semibold mb-2">3. Environment Variables Check</h2>
        <ul className="text-sm space-y-1">
          <li>Clerk Publishable Key: {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? "✅ Set" : "❌ Missing"}</li>
          <li>Clerk Secret Key: {process.env.CLERK_SECRET_KEY ? "✅ Set" : "❌ Missing"}</li>
          <li>Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing"}</li>
          <li>Supabase Service Role Key: {process.env.SUPABASE_SERVICE_ROLE_KEY ? "✅ Set" : "❌ Missing"}</li>
        </ul>
      </section>
      
      <div className="text-sm text-gray-500 italic">
        * This page is for diagnostics only. Remove it before production.
      </div>
    </div>
  );
}
