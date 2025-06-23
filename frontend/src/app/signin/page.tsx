// "use client"
// import Link from "next/link"

// import { Button } from "@/components/ui/button"
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"


// export function LoginForm() {
//   return (
//     <div className="h-full w-full flex flex-col justify-center items-center">
//       <Card className="mx-auto max-w-sm">
//         <CardHeader>
//           <CardTitle className="text-xl">Sign Up</CardTitle>
//           <CardDescription>
//             Enter your information to create an account
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="grid gap-4">
//             <div className="grid gap-2">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 placeholder="m@example.com"
//                 required
//               />
//             </div>
//             <div className="grid gap-2">
//               <Label htmlFor="password">Password</Label>
//               <Input id="password" type="password" />
//             </div>
//             <Button type="submit" className="w-full">
//               Login
//             </Button>
//             <Button variant="outline" className="w-full">
//               Sign up with Google
//             </Button>
//           </div>
//           <div className="mt-4 text-center text-sm">
//             Already have an account?{" "}
//             <Link href="#" className="underline">
//               Sign in
//             </Link>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

// export default LoginForm;

"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronRight } from "lucide-react"
import Particles from "@/components/particles"
import AnimatedGradientText from "@/components/animated-gradient-text"

export function LoginForm() {
  return (
    <div className="min-h-screen relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Particles />
      <div className="relative z-10 h-screen w-full flex flex-col justify-center items-center p-4">
        <div className="mb-8">
          <AnimatedGradientText>
            Welcome Back
          </AnimatedGradientText>
        </div>

        <Card className="mx-auto max-w-sm bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">Sign In</CardTitle>
            <CardDescription className="text-gray-300">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <Input
                  id="password"
                  type="password"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg hover:shadow-purple-500/25 transition-all duration-300">
                Sign In
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white">
                Sign in with Google
              </Button>
            </div>
            <div className="mt-4 text-center text-sm text-gray-300">
              Don't have an account?{" "}
              <Link href="/signup" className="underline text-purple-400 hover:text-purple-300 transition-colors">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default LoginForm;