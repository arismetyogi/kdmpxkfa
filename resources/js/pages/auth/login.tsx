import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { Form } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { SharedData } from '@/types';

interface LoginProps extends SharedData{
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword, digikopUrl }: LoginProps) {
    return (
        <AuthLayout title="" description="">
            <Card className="border border-border bg-card">
                <CardHeader className="text-center">
                    <CardTitle className="text-xl text-foreground">Welcome back</CardTitle>
                    <CardDescription className="text-muted-foreground">Login with your Digi Koperasi Account</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6">
                        <Button variant="outline" asChild className="w-full border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground">
                            <a href={digikopUrl} target="_blank" className="cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" width="778" height="778" viewBox="0 0 778 778" version="1.1">
                                    <path
                                        d="M 553.715 197.040 C 541.413 199.108, 527.036 209.842, 520.719 221.675 C 514.124 234.030, 512.195 252.624, 515.975 267.404 C 518.732 278.180, 523.350 286.394, 530.973 294.079 C 539.536 302.710, 547.937 306.905, 559.544 308.343 C 589.837 312.096, 613.579 294.971, 619.571 265.046 C 625.617 234.851, 608.890 204.416, 582.465 197.533 C 576.216 195.905, 561.921 195.660, 553.715 197.040 M 372.500 288.997 C 369.750 289.408, 365.250 290.049, 362.500 290.422 C 345.095 292.782, 318.804 302.672, 302.124 313.135 C 286.016 323.239, 270.006 337.935, 259.787 352 C 248.927 366.945, 240.229 380.644, 237.245 387.500 C 221.683 423.254, 219.747 469.955, 232.208 509 C 236.301 521.825, 239.662 528.264, 249.958 543 C 266.158 566.189, 266.826 568.091, 267.669 593.500 C 268.454 617.150, 267.553 622.860, 261.558 632.230 C 257.716 638.234, 257 640.134, 257 644.317 C 257 656.635, 268.511 667.989, 281 667.989 C 287.864 667.989, 292.309 666.003, 297.611 660.569 C 301.577 656.503, 303.002 654.161, 303.974 650.108 C 305.598 643.339, 304.834 639.924, 300.043 632.545 C 293.436 622.369, 293.485 622.629, 293.972 600 C 294.215 588.725, 294.418 572.525, 294.424 564 C 294.435 545.924, 294.355 545.668, 283.234 528.348 C 274.279 514.401, 271.906 509.605, 268.221 498 C 258.005 465.830, 260.031 437.213, 274.980 402.533 C 277.596 396.465, 280.572 389.255, 281.595 386.511 C 283.645 381.010, 287.522 376.785, 301.792 364.502 C 331.595 338.847, 361.235 326.907, 395.247 326.856 C 432.748 326.800, 465.536 342.515, 489.181 371.878 C 495.857 380.168, 509.375 406.268, 514.897 421.529 C 523.006 443.938, 524.053 465.549, 518.127 488.187 C 514.112 503.525, 511.490 509.770, 502.398 525.646 C 493.367 541.417, 489.998 551.107, 490.006 561.288 C 490.012 569.458, 491.468 575.858, 493.497 576.637 C 496.023 577.607, 520.037 560.159, 526.978 552.310 C 540.545 536.969, 550.660 515.171, 555.675 490.464 C 557.128 483.307, 557.495 476.764, 557.497 458 C 557.500 432.039, 556.076 421.626, 549.8... [truncated]
                                        stroke="none"
                                        fill="#dc1c24"
                                        fill-rule="evenodd"
                                    />
                                    <path
                                        d="M 360.500 20.112 C 260.815 27.633, 167.409 77.630, 103.185 157.845 C 30.753 248.311, 3.974 365.946, 29.570 481.223 C 35.974 510.067, 43.078 530.750, 55.424 556.500 C 101.763 653.147, 185.311 729.372, 262.045 745.009 C 278.834 748.431, 299.812 747.423, 314.500 742.491 C 345.010 732.245, 366.195 705.595, 370.938 671.494 C 373.450 653.431, 374.283 617.542, 373.071 579.539 C 370.754 506.867, 370.232 478.235, 370.883 459.500 C 371.360 445.786, 371.213 439.665, 370.355 437.500 C 369.676 435.785, 354.341 419.994, 334.564 400.644 L 299.961 366.787 294.339 371.124 C 286.566 377.121, 284.088 380.524, 279.699 391.229 C 274.945 402.826, 274.490 404.156, 276.408 400.865 L 277.943 398.230 301.469 421.865 C 314.407 434.864, 326.795 447.908, 328.997 450.850 L 333 456.201 333 562.505 L 333 668.808 330.605 675.887 C 325.687 690.424, 317.938 699.945, 306.369 705.662 C 299.965 708.827, 297.894 709.337, 289.677 709.766 C 272.843 710.647, 256.667 706.290, 233.742 694.701 C 206.061 680.707, 181.171 662.216, 155.441 636.531 C 100.737 581.921, 69.215 517.603, 59.366 440.500 C 56.906 421.245, 56.898 382.128, 59.350 362 C 70.843 267.628, 116.575 184.225, 188.500 126.465 C 198.370 118.538, 221.674 103.153, 233.500 96.755 C 301.639 59.892, 377.492 49.450, 460.106 65.558 C 510.628 75.409, 559.619 97.771, 599 128.956 C 612.327 139.509, 636.207 163.406, 646.907 176.898 C 687.545 228.137, 712.147 290.022, 719.497 359.500 C 721.463 378.076, 721.452 416.755, 719.476 435.570 C 708.846 536.797, 660.139 622.950, 584 675.201 C 549.658 698.768, 505.831 717.014, 469.345 722.932 C 462.830 723.988, 451.561 725.803, 444.303 726.965 C 428.588 729.479, 421.565 731.435, 418.984 734.016 C 414.028 738.972, 412.734 754.445, 416.812 759.986 C 422.854 768.194, 444.868 767.694, 482.783 758.488 C 535.727 745.631, 584.523 721.824, 626.500 688.370 C 640.571 677.155, 667.064 650.677, 678.397 636.500 C 722.658 581.131, 749.448 515.530, 758.641 440 C 760.800 422.261, 761.130 374.61... [truncated]
                                        stroke="none"
                                        fill="#241c23"
                                        fill-rule="evenodd"
                                    />
                                </svg>
                                Login with Digi Koperasi
                            </a>
                        </Button>
                        <Form method="post" action={route('login')} resetOnSuccess={['password']} className="flex flex-col gap-6">
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-6">
                                        <div className="grid gap-2">
                                            <Label htmlFor="email" className="text-foreground">Email address</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                name="email"
                                                required
                                                autoFocus
                                                tabIndex={1}
                                                autoComplete="email"
                                                placeholder="email@example.com"
                                                className="border-border bg-background text-foreground placeholder:text-muted-foreground"
                                            />
                                            <InputError message={errors.email} />
                                        </div>

                                        <div className="grid gap-2">
                                            <div className="flex items-center">
                                                <Label htmlFor="password" className="text-foreground">Password</Label>
                                                {canResetPassword && (
                                                    <TextLink href={route('password.request')} className="ml-auto text-sm text-foreground" tabIndex={5}>
                                                        Forgot password?
                                                    </TextLink>
                                                )}
                                            </div>
                                            <Input
                                                id="password"
                                                type="password"
                                                name="password"
                                                required
                                                tabIndex={2}
                                                autoComplete="current-password"
                                                placeholder="Password"
                                                className="border-border bg-background text-foreground placeholder:text-muted-foreground"
                                            />
                                            <InputError message={errors.password} />
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <Checkbox id="remember" name="remember" tabIndex={3} />
                                            <Label htmlFor="remember" className="text-foreground">Remember me</Label>
                                        </div>

                                        <Button type="submit" className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90" tabIndex={4} disabled={processing}>
                                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                            Log in
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Form>
                    </div>
                </CardContent>
            </Card>

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600 dark:text-green-400">{status}</div>}
        </AuthLayout>
    );
}
